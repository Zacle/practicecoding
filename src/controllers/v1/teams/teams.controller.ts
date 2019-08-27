import {
    Authenticated,
    BodyParams,
    Controller,
    Get,
    PathParams,
    Post,
    Req,
    Res,
    Next,
    Required,
    MergeParams,
    Delete,
    Put,
    QueryParams
} from "@tsed/common";
import * as Express from "express";
import { HTTPStatusCodes } from "../../../util/httpCode";
import { InsightResponse } from "../../../interfaces/InterfaceFacade";
import {Summary} from "@tsed/swagger";
import { Teams } from "../../../models/Teams";
import { TeamsService } from "../../../services/team/Teams.service";

@Controller("/teams")
export class TeamsCtrl {

    constructor(private teams: TeamsService) {}

    @Get("/")
    @Summary("Get all teams")
    @Authenticated({role: "admin"})
    async getAllTeams(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.teams.getAllTeams();
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                console.log("SUCCESS: ", result.body.result);
                response.json(result.body.result);
                resolve();
            }
            catch(err) {
                console.log("FAILURE: ", err);
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Get("/my")
    @Summary("Get all teams that contain the user")
    async getTeams(@Req() request: Express.Request, @Res() response: Express.Response,
                   @Required() @QueryParams("username") username: string) {
        return new Promise<Teams>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.teams.getTeams(username);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Get("/myown")
    @Summary("Get all teams that contain the user")
    @Authenticated()
    async getMyTeams(@Req() request: Express.Request, @Res() response: Express.Response,
                   @Required() @QueryParams("username") username: string) {
        return new Promise<Teams>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.teams.getMyTeams(username);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                console.log("ERROR: ", err);
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Post("/")
    @Summary("Add a new team")
    @Authenticated()
    async addTeam(@Required() @BodyParams("name") name: string,
                  @Req() request: Express.Request,
                  @Res() response: Express.Response) {
        
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.createTeam(name, request.user._id);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Delete("/")
    @Summary("Delete all teams")
    @Authenticated({role: 'admin'})
    async deleteTeams(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.deleteTeams();
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Get("/:id")
    @Summary("Get a specific team")
    async getTeam(@Required() @PathParams("id") teamID: string,
                  @Req() request: Express.Request,
                  @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.getTeam(teamID);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Delete("/:id")
    @Summary("Delete a team")
    @Authenticated()
    async deleteTeam(@Required() @PathParams("id") teamID: string,
                     @Req() request: Express.Request,
                     @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.deleteam(teamID, request.user._id);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Get("/:id/members")
    @Summary("Get team members")
    @Authenticated()
    async getTeamMembers(@Required() @PathParams("id") teamID: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.getTeamMembers(teamID);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });    
    }

    @Post("/:id/members")
    @Summary("Add a user to the team")
    @Authenticated()
    async addTeamMember(@Required() @PathParams("id") teamID: string,
                        @Required() @BodyParams("uid") userID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.addTeamMember(teamID, userID);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Delete("/:id/members")
    @MergeParams()
    @Summary("Delete a user from the team")
    @Authenticated()
    async deleteTeamMember(@Required() @PathParams("id") teamID: string,
                           @Required() @QueryParams("uid") userID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {
        return new Promise<Teams>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.teams.deleteTeamMember(teamID, userID);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }
}