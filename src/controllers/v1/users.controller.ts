"use strict";

import {BodyParams, Controller, Post, Req, Required, Res, Status, PathParams, Get} from "@tsed/common";
import {Summary} from "@tsed/swagger";
import * as Express from "express";
import Passport = require("passport");
import {BadRequest} from "ts-httpexceptions";
import { IUser, InsightResponse } from "../../interfaces/InterfaceFacade";
import { HTTPStatusCodes } from "../../util/httpCode";
import { API_ERRORS } from "../../util/app.error";
import { Users } from "../../models/Users";
import { PassportService } from "../../services/Passport.service";
import { resolve } from "bluebird";

/*
 * REST end-point for authentication
*/

@Controller("/users")
export class UsersCtrl {

    /**
     * Authenticate user with local info (in Database).
     * @param email
     * @param password
     * @param request
     * @param response
     * @param next
     */
    @Post("/login")
    @Summary("Log in user with email and password")
    async login(@Required() @BodyParams("email") email: string,
                @Required() @BodyParams("password") password: string,
                @Req() request: Express.Request,
                @Res() response: Express.Response) {
        
        return new Promise<Users>((resolve, reject) => {
            Passport.authenticate("login", (err, res: InsightResponse) => {
                if (err) {
                    response.status(API_ERRORS.UNAUTHORIZED.status);
                    response.setHeader("Content-Type", "application/json");
                    response.json({
                        success: false,
                        status: "Login Unsuccessfull!",
                        err: "Couldn't log in user"
                    });
                    reject(err);
                }
                else {
                    console.log("RESULT: ", res);
                    const user: any = res.body;
                    if (res && user.name) {
                        response.status(API_ERRORS.USER_NOT_FOUND.status);
                        response.setHeader("Content-Type", "application/json");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                        response.json({
                            success: false,
                            status: "Login Unsuccessfull!",
                            err: "Couldn't log in the user"
                        });
                        reject(!!err);
                    }
                    else if (res && user.result) {
                        request.login(user.result, (err) => {
                            if (err) {
                                response.status(API_ERRORS.UNAUTHORIZED.status);
                                response.setHeader("Content-Type", "application/json");
                                response.json({
                                    success: false,
                                    status: "Login Unsuccessfull!",
                                    err: err
                                });
                                reject(err);
                            }
                            let token = PassportService.getToken(user.result);
                            response.status(HTTPStatusCodes.OK);
                            response.setHeader("Content-Type", "application/json");
                            response.json({
                                success: true,
                                status: "Login Successfull!",
                                token: token
                            });
                            resolve(user.result);
                        });
                    }
                }
            })(request, response, () => {});
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
    @Post("/signup")
    @Summary("Create a new account")
    async signup(@Required() @BodyParams("email") email: string,
                 @Required() @BodyParams("password") password: string,
                 @Required() @BodyParams("username") username: string,
                 @Required() @BodyParams("fullname") fullname: string,
                 @Required() @BodyParams("country") country: string,
                 @BodyParams("admin") admin: string,
                 @BodyParams("codeforces") codeforces: string,
                 @BodyParams("uva") uva: string,
                 @BodyParams("livearchive") livearchive: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        return new Promise<Users>((resolve, reject) => {
            Passport.authenticate("signup", (err, res: InsightResponse) => {
                if (err) {
                    response.status(API_ERRORS.USER_ALREADY_EXISTS.status);
                    response.setHeader("Content-Type", "application/json");
                    response.json({
                        success: false,
                        status: "Signup Unsuccessfull!",
                        err: "Could not signup user"
                    });
                    reject(err);
                }
    
                else {
                    const user: any = res.body;

                    if (res && user.name) {
                        response.status(API_ERRORS.USER_NOT_FOUND.status);
                        response.setHeader("Content-Type", "application/json");
                        response.json({
                            success: false,
                            status: "Login Unsuccessfull!",
                            err: "Couldn't log in the user"
                        });
                        reject(!!err);
                    }
                    
                    else if (res && user.result) {
                        request.login(user.result, (err) => {
                            console.log("RESULTTTT: ", user.result);
                            if (err) {
                                response.status(API_ERRORS.UNAUTHORIZED.status);
                                response.setHeader("Content-Type", "application/json");
                                response.json({
                                    success: false,
                                    status: "Signup Unsuccessfull!",
                                    err: "Could not signup user"
                                });
                                reject(err);
                            }
    
                            let token = PassportService.getToken(user.result);
                            response.status(HTTPStatusCodes.OK);
                            response.setHeader("Content-Type", "application/json");
                            response.json({
                                success: true,
                                status: "Signup Successfull!",
                                token: token
                            });
                            resolve(user.result);
                        });
                    }
                }
            })(request, response, () => {});
        });
    }

    /**
     * Log out user.
     * @param request
     */
    @Get("/logout")
    @Summary("Disconnect the user")
    async logout(@Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        request.logOut();
        response.redirect("/");
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
    @Post("/account/profile")
    @Summary("Update user info")
    async update(@BodyParams("fullname") fullname: string,
                 @BodyParams("country") country: string,
                 @BodyParams("codeforces") codeforces: string,
                 @BodyParams("uva") uva: string,
                 @BodyParams("livearchive") livearchive: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "fullname": fullname,
            "country": country,
            "codeforces": codeforces,
            "uva": uva,
            "livearchive": livearchive
        });
    }

    /**
     * Update user password
     * @param password
     * @param confirmPassword
     * @param request
     * @param response
     */
    @Post("/account/password")
    @Summary("Update user password")
    async updatePassword(@Required() @BodyParams("password") password: string,
                         @Required() @BodyParams("confirmPassword") confirmPassword: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "password": password,
            "confirmation": confirmPassword
        });
    }

    /**
     * Validate token to reset email
     * @param email
     * @param request
     * @param response
     */
    @Get("/account/resetEmail/:token")
    @Summary("Update user email")
    async getUpdateEmail(@Required() @PathParams("token") token: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "token": token
        });
    }

    /**
     * Validate token to reset email
     * @param email
     * @param request
     * @param response
     */
    @Post("/account/resetEmail/:token")
    @Summary("Update user email")
    async postUpdateEmail(@Required() @PathParams("token") token: string,
                          @Req() request: Express.Request,
                          @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "token": token
        });
    }

    /**
     * Validate token to reset password
     * @param token
     * @param request
     * @param response
     */
    @Get("/reset/:token")
    @Summary("Validate token to reset password in case of forgotten")
    async getResetToken(@Required() @PathParams("token") token: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "token": token
        });
    }

    /**
     * Validate token to reset password
     * @param token
     * @param request
     * @param response
     */
    @Post("/reset/:token")
    @Summary("Reset password in case of forgotten using the provided token")
    async postResetToken(@Required() @PathParams("token") token: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "token": token
        });
    }

    /**
     * Validate token to reset password
     * @param email
     * @param request
     * @param response
     */
    @Post("/forgot")
    @Summary("Forgot password")
    async forgot(@Required() @BodyParams("email") email: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("users/forgot end-point called");
    }
}