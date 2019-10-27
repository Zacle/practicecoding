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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const swagger_1 = require("@tsed/swagger");
const Express = __importStar(require("express"));
const Passport = require("passport");
const app_error_1 = require("../../../util/app.error");
const Users_1 = require("../../../models/Users");
const Passport_service_1 = require("../../../services/passport/Passport.service");
const Users_service_1 = require("../../../services/users/Users.service");
/*
 * REST end-point for authentication
*/
let UsersCtrl = class UsersCtrl {
    constructor(usersServices, users) {
        this.usersServices = usersServices;
        this.users = users;
    }
    /**
     * Authenticate user with local info (in Database).
     * @param email
     * @param password
     * @param request
     * @param response
     */
    login(email, password, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Passport.authenticate("login", (err, res) => {
                    if (err) {
                        res = err;
                        response.status(res.code);
                        response.setHeader("Content-Type", "application/json");
                        response.json({
                            success: false,
                            status: "Login Unsuccessfull!",
                            err: res.body.name
                        });
                        reject(err);
                    }
                    else {
                        console.log("RESULT: ", res);
                        const user = res.body;
                        if (res && user.name) {
                            response.status(res.code);
                            response.setHeader("Content-Type", "application/json");
                            response.json({
                                success: false,
                                status: "Login Unsuccessfull!",
                                err: user.name
                            });
                            reject(!!err);
                        }
                        else if (res && user.result) {
                            request.login(user.result, { session: false }, (err) => {
                                if (err) {
                                    response.status(app_error_1.API_ERRORS.UNAUTHORIZED.status);
                                    response.setHeader("Content-Type", "application/json");
                                    response.json({
                                        success: false,
                                        status: "Login Unsuccessfull!",
                                        err: err
                                    });
                                    reject(err);
                                }
                                let token = Passport_service_1.PassportService.getToken(user.result);
                                response.status(200 /* OK */);
                                response.setHeader("Content-Type", "application/json");
                                response.json({
                                    success: true,
                                    status: "Login Successfull!",
                                    token: token,
                                    user: request.user
                                });
                                resolve(user.result);
                            });
                        }
                    }
                })(request, response, () => { });
            });
        });
    }
    /**
     * Try to register new account
     * @param email
     * @param password
     * @param codeforces
     * @param uva
     * @param livearchive
     * @param username
     * @param fullname
     * @param country
     * @param request
     * @param response
     */
    signup(email, password, username, fullname, country, admin, codeforces, uva, livearchive, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Passport.authenticate("signup", (err, res) => {
                    if (err) {
                        console.log("ERROR SIGNUP ", err);
                        res = err;
                        response.status(res.code);
                        response.setHeader("Content-Type", "application/json");
                        response.json(res.body.name);
                        reject(err);
                    }
                    else {
                        const user = res.body;
                        if (res && user.name) {
                            response.status(app_error_1.API_ERRORS.USER_NOT_FOUND.status);
                            response.setHeader("Content-Type", "application/json");
                            response.json({
                                success: false,
                                status: "Login Unsuccessfull!",
                                err: user.name
                            });
                            reject(!!err);
                        }
                        else if (res && user.result) {
                            response.status(200 /* OK */);
                            response.setHeader("Content-Type", "application/json");
                            response.json(user.result);
                            resolve(user.result);
                        }
                    }
                })(request, response, () => { });
            });
        });
    }
    /**
     * Log out user.
     * @param request
     */
    logout(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            request.logOut();
            response.redirect("/");
        });
    }
    getByID(id, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.usersServices.findMatchingUsername(id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getByUsername(name, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.usersServices.findByUsername(name);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Try to update user account
     * @param codeforces
     * @param uva
     * @param livearchive
     * @param fullname
     * @param country
     * @param request
     * @param response
     */
    update(fullname, country, codeforces, uva, livearchive, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const profile = {
                    "fullname": fullname,
                    "country": country,
                    "codeforces": codeforces,
                    "uva": uva,
                    "livearchive": livearchive
                };
                try {
                    result = yield this.usersServices.updateProfile(request.user._id, profile);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json({
                        success: true,
                        status: "Update Successfull!",
                        user: result.body.result
                    });
                    resolve(result.body.result);
                }
                catch (err) {
                    response.status(304 /* NOT_MODIFIED */);
                    response.setHeader("Content-Type", "application/json");
                    response.json({
                        success: false,
                        status: "Coudn't modify user information"
                    });
                    reject(err);
                }
            }));
        });
    }
    /**
     * Update user password
     * @param password
     * @param request
     * @param response
     */
    updatePassword(password, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    result = yield this.usersServices.updatePassword(request.user._id, password);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json({
                        success: true,
                        status: "Update Successfull!",
                        user: result.body.result
                    });
                    resolve(result.body.result);
                }
                catch (err) {
                    response.status(304 /* NOT_MODIFIED */);
                    response.setHeader("Content-Type", "application/json");
                    response.json({
                        success: false,
                        status: "Couldn't update user password"
                    });
                    reject(err);
                }
            }));
        });
    }
    /**
     * Validate token to reset email
     * @param email
     * @param request
     * @param response
     */
    postUpdateEmail(oldEmail, newEmail, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.usersServices.updateEmail(oldEmail, newEmail, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getValidationToken(token, response) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.usersServices.validateEmailToken(token);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        }));
    }
    /**
     * Validate token to reset password
     * @param token
     * @param request
     * @param response
     */
    getResetToken(token, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            result = yield this.usersServices.verifyPasswordToken(token);
            if (result) {
                response.status(200 /* OK */);
                response.setHeader("Content-Type", "application/json");
                response.json({
                    success: result,
                    status: "Valid Token"
                });
            }
            else {
                response.status(200 /* OK */);
                response.setHeader("Content-Type", "application/json");
                response.json({
                    success: result,
                    status: "Invalid Token"
                });
            }
        });
    }
    /**
     * Reset password in case of forgotten using the provided token
     * @param token
     * @param request
     * @param response
     */
    postResetToken(token, password, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    result = yield this.usersServices.updatePasswordToken(this.users, request, token, password);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Validate token to reset password
     * @param email
     * @param request
     * @param response
     */
    forgot(email, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    result = yield this.usersServices.forgotPassword(this.users, request, email);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(err);
                }
            }));
        });
    }
};
__decorate([
    common_1.Post("/login"),
    swagger_1.Summary("Log in user with email and password"),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("email")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("password")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "login", null);
__decorate([
    common_1.Post("/signup"),
    swagger_1.Summary("Create a new account"),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("email")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("password")),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams("username")),
    __param(3, common_1.Required()), __param(3, common_1.BodyParams("fullname")),
    __param(4, common_1.Required()), __param(4, common_1.BodyParams("country")),
    __param(5, common_1.BodyParams("admin")),
    __param(6, common_1.BodyParams("codeforces")),
    __param(7, common_1.BodyParams("uva")),
    __param(8, common_1.BodyParams("livearchive")),
    __param(9, common_1.Req()),
    __param(10, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "signup", null);
__decorate([
    common_1.Get("/logout"),
    swagger_1.Summary("Disconnect the user"),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "logout", null);
__decorate([
    common_1.Get("/:username"),
    swagger_1.Summary("Select all users that match the username"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("username")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "getByID", null);
__decorate([
    common_1.Get("/username/:name"),
    swagger_1.Summary("get a user by its id"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("name")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "getByUsername", null);
__decorate([
    common_1.Post("/account/profile"),
    swagger_1.Summary("Update user info"),
    common_1.Authenticated(),
    __param(0, common_1.BodyParams("fullname")),
    __param(1, common_1.BodyParams("country")),
    __param(2, common_1.BodyParams("codeforces")),
    __param(3, common_1.BodyParams("uva")),
    __param(4, common_1.BodyParams("livearchive")),
    __param(5, common_1.Req()),
    __param(6, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "update", null);
__decorate([
    common_1.Post("/account/password"),
    swagger_1.Summary("Update user password"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("password")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "updatePassword", null);
__decorate([
    common_1.Post("/account/resetEmail"),
    swagger_1.Summary("Update user email"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("oldEmail")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("newEmail")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "postUpdateEmail", null);
__decorate([
    common_1.Get("/activate/:token"),
    swagger_1.Summary("Validate token to create a new account"),
    __param(0, common_1.PathParams("token")), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersCtrl.prototype, "getValidationToken", null);
__decorate([
    common_1.Get("/reset/:token"),
    swagger_1.Summary("Validate token to reset password in case of forgotten"),
    __param(0, common_1.PathParams("token")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "getResetToken", null);
__decorate([
    common_1.Post("/reset/:token"),
    swagger_1.Summary("Reset password in case of forgotten using the provided token"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("token")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("password")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "postResetToken", null);
__decorate([
    common_1.Post("/forgot"),
    swagger_1.Summary("Forgot password"),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("email")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersCtrl.prototype, "forgot", null);
UsersCtrl = __decorate([
    common_1.Controller("/users"),
    __param(1, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Users_service_1.UsersService, Object])
], UsersCtrl);
exports.UsersCtrl = UsersCtrl;
//# sourceMappingURL=users.controller.js.map