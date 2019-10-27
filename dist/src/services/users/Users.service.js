"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const app_error_1 = require("../../util/app.error");
const Users_1 = require("../../models/Users");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const async_1 = __importDefault(require("async"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let UsersService = class UsersService {
    constructor(users) {
        this.users = users;
    }
    /**
     * Find all users registered in our website
     * @returns {Promise<InsightResponse>}
     */
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            let allUsers;
            try {
                allUsers = yield this.users.find({}).select("-__v").exec();
            }
            catch (err) {
                return Promise.reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "An Error occurred while trying to retrieve users"
                    }
                });
            }
            return Promise.resolve({
                code: 200 /* OK */,
                body: {
                    result: allUsers
                }
            });
        });
    }
    /**
     * Delete all users registered in our website
     * @returns {Promise<InsightResponse>}
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let allUsers;
            try {
                yield this.users.find({}).remove().exec();
            }
            catch (err) {
                return Promise.reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "An Error occurred while trying to retrieve users"
                    }
                });
            }
            return Promise.resolve({
                code: 200 /* OK */,
                body: {
                    result: allUsers
                }
            });
        });
    }
    /**
     * Delete a specific user registered in our website
     * @param id id of the user to be deleted
     * @returns {Promise<InsightResponse>}
     */
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.users.findById(id, '-__v').remove().exec();
            }
            catch (err) {
                return Promise.reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "An Error occurred while trying to delete this user"
                    }
                });
            }
            return Promise.resolve({
                code: 200 /* OK */,
                body: {
                    result: "Removed"
                }
            });
        });
    }
    /**
     * Find a user by its id
     * @param id id to look for in the database
     * @returns {Promise<InsightResponse>}
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.users.findById(id, '-__v').exec();
                    if (!result) {
                        return reject({
                            code: app_error_1.API_ERRORS.USER_NOT_FOUND.status,
                            body: {
                                name: app_error_1.API_ERRORS.USER_NOT_FOUND.message
                            }
                        });
                    }
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: result
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "An Error occurred while trying to retrieve user by its id"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return all users that match the username
     * @param username
     */
    findMatchingUsername(username) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let users;
            try {
                users = yield this.users.find({
                    "username": {
                        "$regex": username,
                        "$options": "i"
                    }
                }).limit(10).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: users
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get users"
                    }
                });
            }
        }));
    }
    /**
     * Find a user by its username
     * @param username username to look for in the database
     * @returns {Promise<InsightResponse>}
     */
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.users.findOne({ username: username, activated: true }, '-__v').exec();
                    if (!result) {
                        return reject({
                            code: app_error_1.API_ERRORS.USER_NOT_FOUND.status,
                            body: {
                                name: app_error_1.API_ERRORS.USER_NOT_FOUND.message
                            }
                        });
                    }
                    let user = {
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
                        code: 200 /* OK */,
                        body: {
                            result: user
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "An Error occurred while trying to retrieve user by its username"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if the username is already taken
     * @param username username to look for in the database
     * @returns {Promise<boolean>}
     */
    usernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.users.findOne({ username: username }, '-__v').exec();
                    if (!result) {
                        return resolve(false);
                    }
                    return resolve(true);
                }
                catch (err) {
                    return reject(err);
                }
            }));
        });
    }
    /**
     * Verify if the user already exist with this email
     * @param email email to verify
     * @returns {Promise<InsightResponse>}
     */
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                    if (result) {
                        return reject({
                            code: app_error_1.API_ERRORS.USER_ALREADY_EXISTS.status,
                            body: {
                                name: app_error_1.API_ERRORS.USER_ALREADY_EXISTS.message
                            }
                        });
                    }
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: result
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "An Error occurred while trying to retrieve user by its email"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if the user already exist with this email
     * @param email email to verify
     * @returns {Promise<boolean>}
     */
    emailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                    if (result) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
                catch (err) {
                    return reject(err);
                }
            }));
        });
    }
    /**
     * Function used to validate email provided by the user
     * @param email email to validate
     * @throws an error if the email is not valid
     */
    validateEmail(email) {
        const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regEmail.test(email);
    }
    /**
     * Login user with the given credentials
     * @param email
     * @param password
     */
    findByCredential(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!this.validateEmail(email.toLowerCase())) {
                        return reject({
                            code: 400 /* BAD_REQUEST */,
                            body: {
                                name: "Email invalid"
                            }
                        });
                    }
                    user = yield this.users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                    if (!user) {
                        return reject({
                            code: app_error_1.API_ERRORS.USER_NOT_FOUND.status,
                            body: {
                                name: app_error_1.API_ERRORS.USER_NOT_FOUND.message
                            }
                        });
                    }
                    yield this.comparePassword(user.password, password, (err, isMatch) => {
                        if (err) {
                            return reject({
                                code: app_error_1.API_ERRORS.USER_WRONG_CREDENTIALS.status,
                                body: {
                                    name: app_error_1.API_ERRORS.USER_WRONG_CREDENTIALS.message
                                }
                            });
                        }
                        if (isMatch) {
                            if (!user.activated) {
                                return reject({
                                    code: 403 /* FORBIDDEN */,
                                    body: {
                                        name: "You must activate your account first. Check your email"
                                    }
                                });
                            }
                            return resolve({
                                code: 200 /* OK */,
                                body: {
                                    result: user
                                }
                            });
                        }
                        return reject({
                            code: app_error_1.API_ERRORS.USER_WRONG_CREDENTIALS.status,
                            body: {
                                name: app_error_1.API_ERRORS.USER_WRONG_CREDENTIALS.message
                            }
                        });
                    });
                }
                catch (err) {
                    console.log("LOGIN ERROR: ", err);
                    reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "An Error occurred while trying to retrieve user by its email and password"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Compare two passwords
     * @param password password saved in the database
     * @param candidatePassword password submitted for authentication
     * @param cb function to be called after comparison
     */
    comparePassword(password, candidatePassword, cb) {
        bcrypt_nodejs_1.default.compare(candidatePassword, password, (err, isMatch) => {
            cb(err, isMatch);
        });
    }
    /**
     * Register a new User in our website
     * @param user user to be registered
     * @returns {Promise<InsightResponse>}
     */
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let res;
                let data = {
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
                let response;
                try {
                    if (!this.validateEmail(user.email.toLowerCase())) {
                        return reject({
                            code: 400 /* BAD_REQUEST */,
                            body: {
                                name: "Email invalid"
                            }
                        });
                    }
                    const emailExist = yield this.emailExists(user.email.toLowerCase());
                    if (emailExist) {
                        return reject({
                            code: 302 /* FOUND */,
                            body: {
                                name: "Email already exists"
                            }
                        });
                    }
                    const usernameExist = yield this.usernameExists(user.username);
                    if (usernameExist) {
                        return reject({
                            code: 302 /* FOUND */,
                            body: {
                                name: "Username already exists"
                            }
                        });
                    }
                    const hashed = yield new Promise((resolve, reject) => {
                        bcrypt_nodejs_1.default.genSalt(10, (err, salt) => {
                            if (err) {
                                reject(err);
                            }
                            bcrypt_nodejs_1.default.hash(user.password, salt, undefined, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    reject(err);
                                }
                                resolve(hash);
                            }));
                        });
                    });
                    res = yield this.users.findOne({
                        email: user.email
                    }, "-__v").exec();
                    if (!res) {
                        data.password = hashed;
                        yield this.users.create(data);
                    }
                    response = yield this.sendActivationLink(this.users, data.email);
                    return resolve(response);
                }
                catch (err) {
                    console.log("CREATE ERROR: ", err);
                    if (err.body.name) {
                        return reject(err);
                    }
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "An Error occurred while trying to create a new user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Update user profile based on information provided. Authentication required
     * @param id id of the user to update the profile
     * @param profile information to be updated
     * @returns the updated user information
     */
    updateProfile(id, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let updt;
                try {
                    result = yield this.findById(id);
                    let user = result.body.result;
                    user.fullname = profile.fullname || user.fullname;
                    user.country = profile.country || user.country;
                    user.codeforces = profile.codeforces || "";
                    user.livearchive = profile.livearchive || "";
                    user.uva = profile.uva || "";
                    updt = yield this.users.findByIdAndUpdate(user._id, user, { new: true, select: "-__v" }).exec();
                    resolve({
                        code: 200 /* OK */,
                        body: {
                            result: updt
                        }
                    });
                }
                catch (err) {
                    reject({
                        code: 304 /* NOT_MODIFIED */,
                        body: {
                            name: "Couldn't modify the user information"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Update the user password
     * @param id the id of the user to update password
     * @param password new password
     * @returns the updated password
     */
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let updt;
                try {
                    result = yield this.findById(id);
                    let user = result.body.result;
                    bcrypt_nodejs_1.default.genSalt(10, (err, salt) => {
                        if (err) {
                            reject({
                                code: 304 /* NOT_MODIFIED */,
                                body: {
                                    name: "Couldn't modify the user password"
                                }
                            });
                        }
                        bcrypt_nodejs_1.default.hash(password, salt, undefined, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                reject({
                                    code: 304 /* NOT_MODIFIED */,
                                    body: {
                                        name: "Couldn't modify the user password"
                                    }
                                });
                            }
                            user.password = hash;
                            updt = yield this.users.findByIdAndUpdate(user._id, user, { new: true, select: "-__v" }).exec();
                            resolve({
                                code: 200 /* OK */,
                                body: {
                                    result: updt
                                }
                            });
                        }));
                    });
                }
                catch (err) {
                    reject({
                        code: 304 /* NOT_MODIFIED */,
                        body: {
                            name: "Couldn't modify the user password"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Validate the token sent to the user to create a new account
     * @param token
     */
    validateEmailToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                try {
                    user = yield this.users.findOne({ emailValidationToken: token }).exec();
                    if (user) {
                        let saveUser = new this.users(user);
                        saveUser.activated = true;
                        yield saveUser.save();
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: "Valid token"
                            }
                        });
                    }
                    return reject({
                        name: 404 /* NOT_FOUND */,
                        body: {
                            name: "Validation token not found"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        name: 404 /* NOT_FOUND */,
                        body: {
                            name: "Validation token error"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Update user's email
     * @param oldEmail
     * @param newEmail
     * @param userID
     */
    updateEmail(oldEmail, newEmail, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let isEmailExists;
                try {
                    isEmailExists = yield this.users.findById(userID).exec();
                    if (!isEmailExists) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "User not found"
                            }
                        });
                    }
                    if (isEmailExists.email !== oldEmail) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Please enter your current email"
                            }
                        });
                    }
                    if (!this.validateEmail(newEmail.toLowerCase())) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "New email format is not valid"
                            }
                        });
                    }
                    let newEmailExists = yield this.emailExists(newEmail.toLowerCase());
                    if (newEmailExists) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "New email is already taken"
                            }
                        });
                    }
                    let saveUser = new this.users(isEmailExists);
                    saveUser.email = newEmail;
                    yield saveUser.save();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: "Email updated"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't update email. Try again later!"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if the token provided is valid or has not yet expired
     * @param token reset token sent to user via email
     * @returns true if it is valid and has not yet expired
     */
    verifyPasswordToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            try {
                user = yield this.users.findOne({ passwordResetToken: token })
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
        });
    }
    /**
     * Update password based on the token
     * @param users
     * @param request
     * @param token
     * @param password
     */
    updatePasswordToken(users, request, token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let res;
                try {
                    async_1.default.waterfall([
                        function resetPassword(done) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let user;
                                let updt;
                                try {
                                    user = yield users.findOne({ passwordResetToken: token })
                                        .where("passwordResetExpires")
                                        .gt(Date.now())
                                        .exec();
                                    if (!user) {
                                        return reject({
                                            code: 404 /* NOT_FOUND */,
                                            body: {
                                                name: "Password reset token is invalid or has expired."
                                            }
                                        });
                                    }
                                    const hashed = yield new Promise((resolve, reject) => {
                                        bcrypt_nodejs_1.default.genSalt(10, (err, salt) => {
                                            if (err) {
                                                reject(err);
                                            }
                                            bcrypt_nodejs_1.default.hash(password, salt, undefined, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                                                if (err) {
                                                    reject(err);
                                                }
                                                let saveUser = new users(user);
                                                saveUser.password = hash;
                                                saveUser.passwordResetToken = undefined;
                                                saveUser.passwordResetExpires = undefined;
                                                yield saveUser.save();
                                                resolve(saveUser);
                                            }));
                                        });
                                    });
                                    done(null, hashed);
                                }
                                catch (err) {
                                    return done(err);
                                }
                            });
                        },
                        function sendForgotPasswordEmail(user, done) {
                            res = user;
                            const transporter = nodemailer_1.default.createTransport({
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
                    ], (err, user) => {
                        if (err) {
                            return reject({
                                code: 304 /* NOT_MODIFIED */,
                                body: {
                                    name: "Couldn't modify password"
                                }
                            });
                        }
                        else {
                            res = user;
                            return resolve({
                                code: 200 /* OK */,
                                body: {
                                    result: user
                                }
                            });
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't reset your password. Try again later!"
                        }
                    });
                }
            });
        });
    }
    /**
     * Create a random token and send user an email with a reset link
     * @param users users model
     * @param request Express request
     * @param response Express response
     * @param next Express next
     */
    forgotPassword(users, request, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const API = 'http://localhost:3000';
                let isValidEmail;
                try {
                    isValidEmail = yield this.emailExists(email.toLowerCase());
                    if (!isValidEmail) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "This email doesn't exist"
                            }
                        });
                    }
                    async_1.default.waterfall([
                        function createRandomToken(done) {
                            crypto_1.default.randomBytes(16, (err, buf) => {
                                const token = buf.toString("hex");
                                done(err, token);
                            });
                        },
                        function setRandomToken(token, done) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let user;
                                try {
                                    user = yield users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                                    let saveUser = new users(user);
                                    saveUser.passwordResetToken = token;
                                    saveUser.passwordResetExpires = Date.now() + 7200000; // 3 hours
                                    yield saveUser.save();
                                    done(null, token, saveUser);
                                }
                                catch (err) {
                                    return done(err);
                                }
                            });
                        },
                        function sendForgotPasswordEmail(token, user, done) {
                            const transporter = nodemailer_1.default.createTransport({
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
                    ], (err, info) => {
                        if (err) {
                            return reject({
                                code: 417 /* EXPECTATION_FAILED */,
                                body: {
                                    name: "Couldn't send an email! Make sure it is a valid email and try again."
                                }
                            });
                        }
                        console.log("Email Sent: ", info);
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: "Email sent."
                            }
                        });
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't send an email! Make sure it is a valid email and try again."
                        }
                    });
                }
            }));
        });
    }
    /**
     * Create a random token and send user an email with an activation link
     * @param users users model
     * @param request Express request
     * @param response Express response
     * @param next Express next
     */
    sendActivationLink(users, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const API = 'http://localhost:3000';
                try {
                    async_1.default.waterfall([
                        function createRandomToken(done) {
                            crypto_1.default.randomBytes(16, (err, buf) => {
                                const token = buf.toString("hex");
                                done(err, token);
                            });
                        },
                        function setRandomToken(token, done) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let user;
                                try {
                                    user = yield users.findOne({ email: email.toLowerCase() }, '-__v').exec();
                                    let saveUser = new users(user);
                                    saveUser.emailValidationToken = token;
                                    yield saveUser.save();
                                    done(null, token, saveUser);
                                }
                                catch (err) {
                                    return done(err);
                                }
                            });
                        },
                        function sendValidationEmail(token, user, done) {
                            const transporter = nodemailer_1.default.createTransport({
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
                    ], (err, info) => {
                        if (err) {
                            return reject({
                                code: 417 /* EXPECTATION_FAILED */,
                                body: {
                                    name: "Couldn't send an email! Make sure it is a valid email and try again."
                                }
                            });
                        }
                        console.log("Email Sent: ", info);
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: "An email has been sent to validate your account."
                            }
                        });
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't send an email! Make sure it is a valid email and try again."
                        }
                    });
                }
            }));
        });
    }
};
UsersService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=Users.service.js.map