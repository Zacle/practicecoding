import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { API_ERRORS } from "../../util/app.error";
import { Users } from "../../models/Users";
import { InsightResponse, IUser } from "../../interfaces/InterfaceFacade";
import { BadRequest, NotFound } from "ts-httpexceptions";
import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import * as Express from "express";
import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";

@Service()
export class UsersService {

    constructor(@Inject(Users) private users: MongooseModel<Users>) {}

    /**
     * Find all users registered in our website
     * @returns {Promise<InsightResponse>}
     */
    async find(): Promise<InsightResponse> {
        let allUsers: Users[];

        try {
            allUsers = await this.users.find({}).select("-__v").exec();
        }
        catch (err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to retrieve users"
                }
            });
        }
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: allUsers
            }
        });
    }

    /**
     * Delete all users registered in our website
     * @returns {Promise<InsightResponse>}
     */
    async delete(): Promise<InsightResponse> {
        let allUsers: Users[];

        try {
            await this.users.find({}).remove().exec();
        }
        catch (err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to retrieve users"
                }
            });
        }
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: allUsers
            }
        });
    }

    /**
     * Delete a specific user registered in our website
     * @param id id of the user to be deleted
     * @returns {Promise<InsightResponse>}
     */
    async deleteUser(id: string): Promise<InsightResponse> {

        try {
            await this.users.findById(id, '-__v').remove().exec();
        }
        catch (err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to delete this user"
                }
            });
        }
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: "Removed"
            }
        });
    }

    /**
     * Find a user by its id
     * @param id id to look for in the database
     * @returns {Promise<InsightResponse>}
     */
    async findById(id: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: Users;

            try {
                result = await this.users.findById(id, '-__v').exec();
                if (!result) {
                    return reject({
                        code: API_ERRORS.USER_NOT_FOUND.status,
                        body: {
                            name: API_ERRORS.USER_NOT_FOUND.message
                        }
                    });
                }
        
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: result
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "An Error occurred while trying to retrieve user by its id"
                    }
                });
            }
        });
    }

    /**
     * Find a user by its username
     * @param username username to look for in the database
     * @returns {Promise<InsightResponse>}
     */
    async findByUsername(username: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: Users;

            try {
                result = await this.users.findOne({ username: username }, '-__v').exec();
                
                if (!result) {
                    return Promise.reject({
                        code: API_ERRORS.USER_NOT_FOUND.status,
                        body: {
                            name: API_ERRORS.USER_NOT_FOUND.message
                        }
                    });
                }
        
                return Promise.resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: result
                    }
                });
            }
            catch (err) {
                return Promise.reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "An Error occurred while trying to retrieve user by its username"
                    }
                });
            }
        });
    }

    /**
     * Verify if the user already exist with this email
     * @param email email to verify
     * @returns {Promise<InsightResponse>}
     */
    async findByEmail(email: string): Promise<InsightResponse> {
        let result: Users;

        try {
            this.validateEmail(email.toLowerCase());

            result = await this.users.findOne({ email: email.toLowerCase() }, '-__v').exec();

            if (result) {
                return Promise.reject({
                    code: API_ERRORS.USER_ALREADY_EXISTS.status,
                    body: {
                        name: API_ERRORS.USER_ALREADY_EXISTS.message
                    }
                });
            }
        }
        catch (err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to retrieve user by its email"
                }
            });
        }
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: result
            }
        });
    }

    /**
     * Function used to validate email provided by the user
     * @param email email to validate
     * @throws an error if the email is not valid
     */
    private validateEmail(email: string) {
        const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(email && regEmail.test(email))) {
            throw new BadRequest("Email is invalid");
        }
    }

    /**
     * Login user with the given credentials
     * @param email 
     * @param password 
     */
    async findByCredential(email: string, password: string): Promise<InsightResponse> {
        let user: Users;

        return new Promise<InsightResponse>(async (resolve, reject) => {
            try {
                this.validateEmail(email.toLowerCase());
                
                user = await this.users.findOne({email: email.toLowerCase()}, '-__v').exec();
        
                if (!user) {
                    reject({
                        code: API_ERRORS.USER_NOT_FOUND.status,
                        body: {
                            name: API_ERRORS.USER_NOT_FOUND.message
                        }
                    });
                }
                
                await this.comparePassword(user.password, password, (err: Error, isMatch: boolean) => {
                    if (err) {
                        reject({
                            code: API_ERRORS.USER_WRONG_CREDENTIALS.status,
                            body: {
                                name: API_ERRORS.USER_WRONG_CREDENTIALS.message
                            }
                        });
                    }
                    if(isMatch) {
                        resolve({
                            code: HTTPStatusCodes.OK,
                            body: {
                                result: user
                            }
                        });
                    }
                    reject({
                        code: API_ERRORS.USER_WRONG_CREDENTIALS.status,
                        body: {
                            name: API_ERRORS.USER_WRONG_CREDENTIALS.message
                        }
                    });
                });
            }
            catch(err) {
                reject({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "An Error occurred while trying to retrieve user by its email and password"
                    }
                });
            }
        });
    }

    /**
     * Compare two passwords
     * @param password password saved in the database
     * @param candidatePassword password submitted for authentication
     * @param cb function to be called after comparison
     */
    private comparePassword(password: string, candidatePassword: string, cb: any) {
        bcrypt.compare(candidatePassword, password, (err: mongoose.Error, isMatch: boolean) => {
            cb(err, isMatch);
          });
    }

    /**
     * Register a new User in our website
     * @param user user to be registered
     * @returns {Promise<InsightResponse>}
     */
    async create(user: IUser): Promise<InsightResponse> {
        let res: Users;
        let data: Users = {
            email: user.email.toLowerCase(),
            password: user.password,
            username: user.username,
            fullname: user.fullname,
            country: user.country,
            codeforces: user.codeforces,
            uva: user.uva,
            livearchive: user.livearchive,
            admin: user.admin,
            teams: [],
            groups: []
        };

        try {
            const hashed = await new Promise<any>((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) { 
                        reject(err); 
                    }
                    bcrypt.hash(user.password, salt, undefined, async (err: mongoose.Error, hash) => {
                        if (err) { 
                            reject(err);
                        }
                        resolve(hash);
                    });
                });
            });
            data.password = hashed;
            await this.users.create(data);

            res = await this.users.findOne({
                        email: user.email
                    }, "-__v").exec();
        }
        catch(err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to create a new user"
                }
            });
        }
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: res
            }
        });
    }

    /**
     * Update user profile based on information provided. Authentication required
     * @param id id of the user to update the profile
     * @param profile information to be updated
     * @returns the updated user information
     */
    async updateProfile(id: string, profile: any): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: InsightResponse;
            let updt: Users;
            try {
                result = await this.findById(id);
                let user: Users = result.body.result;
                user.fullname = profile.fullname || user.fullname;
                user.country = profile.country || user.country;
                user.codeforces = profile.codeforces || user.codeforces;
                user.livearchive = profile.livearchive || user.livearchive;
                user.uva = profile.uva || user.uva;
                updt = await this.users.findByIdAndUpdate(user._id, user, {new: true, select: "-__v"}).exec();
            
                resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: updt
                    }
                });
            }
            catch(err) {
                reject({
                    code: HTTPStatusCodes.NOT_MODIFIED,
                    body: {
                        name: "Couldn't modify the user information"
                    }
                });
            }
        });
    }

    /**
     * Update the user password
     * @param id the id of the user to update password
     * @param password new password
     * @returns the updated password
     */
    async updatePassword(id: string, password: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: InsightResponse;
            let updt: Users;
            try {
                result = await this.findById(id);
                let user: Users = result.body.result;
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) { 
                        reject({
                            code: HTTPStatusCodes.NOT_MODIFIED,
                            body: {
                                name: "Couldn't modify the user password"
                            }
                        }); 
                    }
                    bcrypt.hash(password, salt, undefined, async (err: mongoose.Error, hash) => {
                        if (err) { 
                            reject({
                                code: HTTPStatusCodes.NOT_MODIFIED,
                                body: {
                                    name: "Couldn't modify the user password"
                                }
                            }); 
                        }
                        user.password = hash;
                        updt = await this.users.findByIdAndUpdate(user._id, user, {new: true, select: "-__v"}).exec();
                        resolve({
                            code: HTTPStatusCodes.OK,
                            body: {
                                result: updt
                            }
                        });
                    });
                });
            }
            catch(err) {
                reject({
                    code: HTTPStatusCodes.NOT_MODIFIED,
                    body: {
                        name: "Couldn't modify the user password"
                    }
                });
            }
        });
    }

    async verifyEmailToken(token: string): Promise<Boolean> {
        return Promise.reject(false);
    }

    async updateEmail(token: string, email: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    /**
     * Verify if the token provided is valid or has not yet expired
     * @param token reset token sent to user via email
     * @returns true if it is valid and has not yet expired
     */
    async verifyPasswordToken(token: string): Promise<Boolean> {
        let user: Users;
        try {
            user = await this.users.findOne({ passwordResetToken: token })
                             .where("passwordResetExpires")
                             .gt(Date.now())
                             .exec();
            if (!user) {
                return false;
            }
            return true;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Update password based on the token
     * @param users 
     * @param request 
     * @param token 
     * @param password 
     */
    async updatePasswordToken(users: MongooseModel<Users>, request: Express.Request, token: string, password: string): Promise<InsightResponse> {
        
        let res: Users;
        async.waterfall([
            async function resetPassword(done: Function) {
                let user: Users;
                let updt: Users;
                try {
                    user = await users.findOne({ passwordResetToken: token })
                                    .where("passwordResetExpires")
                                    .gt(Date.now())
                                    .exec();
                    if (!user) {
                        return Promise.reject({
                            code: HTTPStatusCodes.NOT_FOUND,
                            body: {
                                name: "Password reset token is invalid or has expired."
                            }
                        });
                    }
                    const hashed = await new Promise<any>((resolve, reject) => {
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) { 
                                reject(err); 
                            }
                            bcrypt.hash(password, salt, undefined, async (err: mongoose.Error, hash) => {
                                if (err) { 
                                    reject(err);
                                }
                                user.password = hash;
                                user.passwordResetToken = undefined;
                                user.passwordResetExpires = undefined;
                                updt = await users.findByIdAndUpdate(user._id, user, {new: true, select: "-__v"}).exec();
                                resolve(updt);
                            });
                        });
                    });
                    done(null, hashed);
                }
                catch (err) {
                    return done(err);
                }
            },
            function sendForgotPasswordEmail(user: Users, done: Function) {
                res = user;
                const transporter = nodemailer.createTransport({
                    service: "SendGrid",
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD
                    }
                });
                const mailOptions = {
                    to: user.email,
                    from: "practicecodingoj@gmail.com",
                    subject: "Your password has been changed",
                    text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
                };
                transporter.sendMail(mailOptions, (err) => {
                    done(err, user);
                });
            }
        ], (err, user: Users) => {
            if (err) {
                return Promise.reject({
                    code: HTTPStatusCodes.NOT_MODIFIED,
                    body: {
                        name: "Couldn't modify password"
                    }
                });
            }
            else {
                res = user;
                return Promise.resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: user
                    }
                });
            }
        });
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: res
            }
        });
    }

    /**
     * Create a random token and send user an email with a reset link
     * @param users users model
     * @param request Express request
     * @param response Express response
     * @param next Express next
     */
    async forgotPassword(users: MongooseModel<Users>, request: Express.Request, email: string): Promise<InsightResponse> {
        
        async.waterfall([
            function createRandomToken(done: Function) {
                crypto.randomBytes(16, (err, buf) => {
                  const token = buf.toString("hex");
                  done(err, token);
                });
            },
            async function setRandomToken(token: any, done: Function) {
                let user: Users;
                let updt: Users;
                try {
                    user = await users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                    if (!user) {
                        throw new NotFound("Account with that email address does not exist.");
                    }
                    user.passwordResetToken = token;
                    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                    updt = await users.findByIdAndUpdate(user._id, user, {new: true, select: "-__v"}).exec();
                    done(null, token, updt);
                }
                catch (err) {
                    return done(err);
                }
            },
            function sendForgotPasswordEmail(token: any, user: Users, done: Function) {
                const transporter = nodemailer.createTransport({
                    service: "SendGrid",
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD
                    }
                });
                const mailOptions = {
                    to: user.email,
                    from: "zacharienziuki@gmail.com",
                    subject: "Reset your password on Practicecodingoj",
                    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                      Please click on the following link, or paste this into your browser to complete the process:\n\n
                      http://${request.headers.host}/users/reset/${token}\n\n
                      If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    done(err, info);
                });
            }
        ], (err: Error, info) => {
            if (err) {
                throw err;
            }
            console.log("Email Sent: ", info);
            return Promise.resolve({
                code: HTTPStatusCodes.OK,
                body: {
                    result: "Email sent."
                }
            });
        });
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: "Email sent."
            }
        });
    }
}