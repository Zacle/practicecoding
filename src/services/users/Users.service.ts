import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { API_ERRORS } from "../../util/app.error";
import { Users } from "../../models/Users";
import { InsightResponse, IUser } from "../../interfaces/InterfaceFacade";
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
     * Return all users that match the username
     * @param username 
     */
    findMatchingUsername(username: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let users: Users[];

            try {
                users = await this.users.find({
                    "username": {
                        "$regex": username,
                        "$options": "i"
                    }
                }).limit(10).exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: users
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get users"
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
                result = await this.users.findOne({ username: username, activated: true }, '-__v').exec();
                
                if (!result) {
                    return reject({
                        code: API_ERRORS.USER_NOT_FOUND.status,
                        body: {
                            name: API_ERRORS.USER_NOT_FOUND.message
                        }
                    });
                }

                let user: any = {
                    _id: result._id,
                    fullname: result.fullname,
                    codeforces: result.codeforces,
                    uva: result.uva,
                    livearchive: result.livearchive,
                    username: result.username,
                    joined: result.joined,
                    country: result.country
                };
        
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: user
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "An Error occurred while trying to retrieve user by its username"
                    }
                });
            }
        });
    }

    /**
     * Verify if the username is already taken
     * @param username username to look for in the database
     * @returns {Promise<boolean>}
     */
    async usernameExists(username: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let result: Users;

            try {
                result = await this.users.findOne({ username: username, activated: true }, '-__v').exec();
                
                if (!result) {
                    return resolve(false);
                }
        
                return resolve(true);
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    /**
     * Verify if the user already exist with this email
     * @param email email to verify
     * @returns {Promise<InsightResponse>}
     */
    async findByEmail(email: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: Users;

            try {

                result = await this.users.findOne({ email: email.toLowerCase() }, '-__v').exec();

                if (result) {
                    return reject({
                        code: API_ERRORS.USER_ALREADY_EXISTS.status,
                        body: {
                            name: API_ERRORS.USER_ALREADY_EXISTS.message
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
                        name: "An Error occurred while trying to retrieve user by its email"
                    }
                });
            }
        });
    }

    /**
     * Verify if the user already exist with this email
     * @param email email to verify
     * @returns {Promise<boolean>}
     */
    async emailExists(email: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let result: Users;

            try {

                result = await this.users.findOne({ email: email.toLowerCase(), activated: true }, '-__v').exec();

                if (result) {
                    return resolve(true);
                }
                return resolve(false);
            }
            catch (err) {
                return reject(err);
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
        return regEmail.test(email);
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
                if (!this.validateEmail(email.toLowerCase())) {
                    return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Email invalid"
                        }
                    });
                }
                
                user = await this.users.findOne({email: email.toLowerCase()}, '-__v').exec();
        
                if (!user) {
                    return reject({
                        code: API_ERRORS.USER_NOT_FOUND.status,
                        body: {
                            name: API_ERRORS.USER_NOT_FOUND.message
                        }
                    });
                }
                
                await this.comparePassword(user.password, password, (err: Error, isMatch: boolean) => {
                    if (err) {
                        return reject({
                            code: API_ERRORS.USER_WRONG_CREDENTIALS.status,
                            body: {
                                name: API_ERRORS.USER_WRONG_CREDENTIALS.message
                            }
                        });
                    }
                    if(isMatch) {
                        if (!user.activated) {
                            return reject({
                                code: HTTPStatusCodes.FORBIDDEN,
                                body: {
                                    name: "You must activate your account first. Check your email"
                                }
                            });
                        }
                        return resolve({
                            code: HTTPStatusCodes.OK,
                            body: {
                                result: user
                            }
                        });
                    }
                    return reject({
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
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let res: Users;
            let data: Users = {
                email: user.email.toLowerCase(),
                password: user.password,
                username: user.username,
                fullname: user.fullname,
                country: user.country,
                codeforces: user.codeforces,
                activated: false,
                joined: new Date(),
                uva: user.uva,
                livearchive: user.livearchive,
                admin: user.admin,
                teams: [],
                groups: [],
                contests: []
            };
            let response: InsightResponse;

            try {
                if (!this.validateEmail(user.email.toLowerCase())) {
                    return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Email invalid"
                        }
                    });
                }

                const emailExist = await this.emailExists(user.email.toLowerCase());
                if (emailExist) {
                    return reject({
                        code: HTTPStatusCodes.FOUND,
                        body: {
                            name: "Email already exists"
                        }
                    });
                }
                const usernameExist = await this.usernameExists(user.username);
                if (usernameExist) {
                    return reject({
                        code: HTTPStatusCodes.FOUND,
                        body: {
                            name: "Username already exists"
                        }
                    });
                }
                
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
                res = await this.users.findOne({
                            email: user.email
                        }, "-__v").exec();

                if (!res) {
                    data.password = hashed;
                    await this.users.create(data);
                }

                response = await this.sendActivationLink(this.users, data.email);
                
                return resolve(response);
            }
            catch(err) {
                console.log("CREATE ERROR: ", err);
                if (err.body.name) {
                    return reject(err);
                }
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "An Error occurred while trying to create a new user"
                    }
                });
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
                user.codeforces = profile.codeforces || "";
                user.livearchive = profile.livearchive || "";
                user.uva = profile.uva || "";
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

    /**
     * Validate the token sent to the user to create a new account
     * @param token 
     */
    async validateEmailToken(token: string): Promise<InsightResponse> {
        return new Promise <InsightResponse>(async (resolve, reject) => {
            let user: Users;

            try {
                user = await this.users.findOne({emailValidationToken: token}).exec();
                
                if (user) {
                    let saveUser = new this.users(user);
                    saveUser.activated = true;
                    await saveUser.save();

                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: "Valid token"
                        }
                    });
                }
                return reject({
                    name: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Validation token not found"
                    }
                });
            }
            catch (err) {
                return reject({
                    name: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Validation token error"
                    }
                });
            }
        });
    }

    /**
     * Update user's email
     * @param oldEmail 
     * @param newEmail 
     * @param userID
     */
    async updateEmail(oldEmail: string, newEmail: string, userID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let isEmailExists: Users;

            try {
                isEmailExists = await this.users.findById(userID).exec();
                if (!isEmailExists) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "User not found"
                        }
                    });
                }
                if (isEmailExists.email !== oldEmail) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Please enter your current email"
                        }
                    });
                }
                if (!this.validateEmail(newEmail.toLowerCase())) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "New email format is not valid"
                        }
                    });
                }
                let newEmailExists: boolean = await this.emailExists(newEmail.toLowerCase());
                if (newEmailExists) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "New email is already taken"
                        }
                    });
                }
                let saveUser = new this.users(isEmailExists);
                saveUser.email = newEmail;
                await saveUser.save();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: "Email updated"
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't update email. Try again later!"
                    }
                });
            }
        });
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
        
        return new Promise<InsightResponse>((resolve, reject) => {
            let res: Users;
            try {
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
                                return reject({
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
                                        let saveUser = new users(user);
                                        saveUser.password = hash;
                                        saveUser.passwordResetToken = undefined;
                                        saveUser.passwordResetExpires = undefined;
                                        await saveUser.save();
                                        resolve(saveUser);
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
                            from: "zacharienziuki@gmail.com",
                            subject: "Your password has been changed",
                            text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
                        };
                        transporter.sendMail(mailOptions, (err) => {
                            done(err, user);
                        });
                    }
                ], (err, user: Users) => {
                    if (err) {
                        return reject({
                            code: HTTPStatusCodes.NOT_MODIFIED,
                            body: {
                                name: "Couldn't modify password"
                            }
                        });
                    }
                    else {
                        res = user;
                        return resolve({
                            code: HTTPStatusCodes.OK,
                            body: {
                                result: user
                            }
                        });
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't reset your password. Try again later!"
                    }
                });
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
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const API = 'http://localhost:3000';
            let isValidEmail: boolean;
            try {
                isValidEmail = await this.emailExists(email.toLowerCase());
                if (!isValidEmail) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "This email doesn't exist"
                        }
                    });
                }

                async.waterfall([
                    function createRandomToken(done: Function) {
                        crypto.randomBytes(16, (err, buf) => {
                          const token = buf.toString("hex");
                          done(err, token);
                        });
                    },
                    async function setRandomToken(token: any, done: Function) {
                        let user: Users;
                        try {
                            user = await users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                            let saveUser = new users(user);
                            saveUser.passwordResetToken = token;
                            saveUser.passwordResetExpires = Date.now() + 7200000; // 3 hours
                            await saveUser.save();
                            done(null, token, saveUser);
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
                            subject: "Reset your password on Practice Coding OJ",
                            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                              Please click on the following link, or paste this into your browser to complete the process:\n\n
                              ${API}/resetPassword/${token}\n\n
                              If you did not request this, please ignore this email and your password will remain unchanged.\n`
                        };
                        transporter.sendMail(mailOptions, (err, info) => {
                            done(err, info);
                        });
                    }
                ], (err: Error, info) => {
                    if (err) {
                        return reject({
                            code: HTTPStatusCodes.EXPECTATION_FAILED,
                            body: {
                                name: "Couldn't send an email! Make sure it is a valid email and try again."
                            }
                        });
                    }
                    console.log("Email Sent: ", info);
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: "Email sent."
                        }
                    });
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't send an email! Make sure it is a valid email and try again."
                    }
                });
            }
        });
    }

    /**
     * Create a random token and send user an email with an activation link
     * @param users users model
     * @param request Express request
     * @param response Express response
     * @param next Express next
     */
    async sendActivationLink(users: MongooseModel<Users>, email: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const API = 'http://localhost:3000';
            try {

                async.waterfall([
                    function createRandomToken(done: Function) {
                        crypto.randomBytes(16, (err, buf) => {
                            const token = buf.toString("hex");
                            done(err, token);
                        });
                    },
                    async function setRandomToken(token: any, done: Function) {
                        let user: Users;
                        try {
                            user = await users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                            let saveUser = new users(user);
                            saveUser.emailValidationToken = token;
                            await saveUser.save();
                            done(null, token, saveUser);
                        }
                        catch (err) {
                            return done(err);
                        }
                    },
                    function sendValidationEmail(token: any, user: Users, done: Function) {
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
                            subject: "Validate your email  on Practice Coding OJ",
                            text: `You are receiving this email because you (or someone else) have registered on Practice Coding OJ with this email.\n\n
                              Please click on the following link, or paste this into your browser to complete the process:\n\n
                              ${API}/validate/${token}\n\n
                              If you did not request this, please ignore this email and the registration will be unsuccessfull.\n`
                        };
                        transporter.sendMail(mailOptions, (err, info) => {
                            done(err, info);
                        });
                    }
                ], (err: Error, info) => {
                    if (err) {
                        return reject({
                            code: HTTPStatusCodes.EXPECTATION_FAILED,
                            body: {
                                name: "Couldn't send an email! Make sure it is a valid email and try again."
                            }
                        });
                    }
                    console.log("Email Sent: ", info);
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: "An email has been sent to validate your account."
                        }
                    });
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't send an email! Make sure it is a valid email and try again."
                    }
                });
            }
        });
    }
}