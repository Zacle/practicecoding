import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../util/httpCode";
import { API_ERRORS } from "../util/app.error";
import { Users } from "../models/Users";
import { InsightResponse, IUser } from "../interfaces/InterfaceFacade";
import { BadRequest } from "ts-httpexceptions";
import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";

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
     * Find a user by its id
     * @param id id to look for in the database
     * @returns {Promise<InsightResponse>}
     */
    async findById(id: string): Promise<InsightResponse> {
        let result: Users;

        try {
            result = await this.users.findById(id, '-__v').exec();
        }
        catch (err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to retrieve user by its id"
                }
            });
        }

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
                console.log("EMAIL FOUND");
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
        console.log("EMAIL NOT FOUND");
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
    
                console.log("USERRRR: ", user);
    
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
                        console.log("MATCHED");
                        resolve({
                            code: HTTPStatusCodes.OK,
                            body: {
                                result: user
                            }
                        });
                    }
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
            admin: user.admin
        };

        try {
            await this.users.create(data);

            res = await this.users.findOne({
                        email: user.email
                    }, "-__v").exec();
        }
        catch(err) {
            console.log("CREATE USER ERRRORR: ", err);
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "An Error occurred while trying to create a new user"
                }
            });
        }
        console.log("CREATED");
        return Promise.resolve({
            code: HTTPStatusCodes.OK,
            body: {
                result: res
            }
        });
    }

    async updateProfile(profile: any): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async updatePassword(password: string, confirmation: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async verifyEmailToken(token: string): Promise<Boolean> {
        return Promise.reject(false);
    }

    async updateEmail(token: string, email: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async verifyPasswordToken(token: string): Promise<Boolean> {
        return Promise.reject(false);
    }

    async updatePasswordToken(token: string, password: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async forgotPassword(): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }
}