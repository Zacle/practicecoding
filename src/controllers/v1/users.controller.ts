"use strict";

import {BodyParams, Controller, Post, Req, Required, Res, Status, PathParams, Get} from "@tsed/common";
import {Summary} from "@tsed/swagger";
import * as Express from "express";
import * as Passport from "passport";
import {BadRequest} from "ts-httpexceptions";
import {IUser} from "../../interfaces/InterfaceFacade";
import { HTTPStatusCodes } from "../../util/httpCode";

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
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "email": email,
            "password": password
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
                 @BodyParams("codeforces") codeforces: string,
                 @BodyParams("uva") uva: string,
                 @BodyParams("livearchive") livearchive: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "email": email,
            "password": password,
            "username": username,
            "fullname": fullname,
            "country": country,
            "codeforces": codeforces,
            "uva": uva,
            "livearchive": livearchive
        });
    }

    /**
     * Log out user.
     * @param request
     */
    @Post("/logout")
    @Summary("Disconnect the user")
    async logout(@Req() request: Express.Request,
                 @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("users/logout end-point called");
    }

    /**
     * Try to update user account
     * @param email
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
    async update(@BodyParams("email") email: string,
                 @BodyParams("fullname") fullname: string,
                 @BodyParams("country") country: string,
                 @BodyParams("codeforces") codeforces: string,
                 @BodyParams("uva") uva: string,
                 @BodyParams("livearchive") livearchive: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            "email": email,
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