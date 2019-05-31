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
    Put
} from "@tsed/common";
import * as Express from "express";
import { HTTPStatusCodes } from "../../../util/httpCode";
import { InsightResponse } from "../../../interfaces/InterfaceFacade";
import {Summary} from "@tsed/swagger";
import { Submissions } from "../../../models/contests/Submissions";
import { Submissions as teamSubmissions } from "../../../models/teamContests/teamSubmissions";

@Controller("/teams")
export class TeamsCtrl {

    @Get("/")
    @Summary("Get all teams")
    @Authenticated()
    async getTeams(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /teams");
    }

    @Post("/")
    @Summary("Add a new team")
    @Authenticated()
    async addTeam(@Required() @BodyParams("name") name: string,
                  @Req() request: Express.Request,
                  @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            name: name
        });
    }

    @Delete("/")
    @Summary("Delete all teams")
    @Authenticated({role: 'admin'})
    async deleteTeams(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("DELETE /teams");
    }

    @Get("/:id")
    @Summary("Get a specific team")
    @Authenticated()
    async getTeam(@Required() @PathParams("id") teamID: string,
                  @Req() request: Express.Request,
                  @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID
        });
    }

    @Delete("/:id")
    @Summary("Delete a team")
    @Authenticated()
    async deleteTeam(@Required() @PathParams("id") teamID: string,
                     @Req() request: Express.Request,
                     @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID
        });
    }

    @Get("/:id/members")
    @Summary("Get team members")
    @Authenticated()
    async getTeamMembers(@Required() @PathParams("id") teamID: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID
        });      
    }

    /**
     * Contests attended by this team
     * @param teamID 
     * @param request 
     * @param response 
     */
    @Get("/:id/contests")
    @Summary("Get team contests")
    @Authenticated()
    async getTeamContests(@Required() @PathParams("id") teamID: string,
                          @Req() request: Express.Request,
                          @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID
        }); 
    }

    @Get("/:id/submissions")
    @Summary("Get team submissions")
    @Authenticated()
    async getTeamSubmissions(@Required() @PathParams("id") teamID: string,
                             @Req() request: Express.Request,
                             @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID
        }); 
    }

    @Post("/:id/members")
    @Summary("Add a user to the team")
    @Authenticated()
    async addTeamMember(@Required() @PathParams("id") teamID: string,
                        @Required() @BodyParams("uid") userID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID,
            userID: userID
        }); 
    }

    /**
     * Add a contest a team has attended
     * @param teamID 
     * @param contestID 
     * @param request 
     * @param response 
     */
    @Post("/:id/contests")
    @Summary("Add a team contest")
    @Authenticated()
    async addContest(@Required() @PathParams("id") teamID: string,
                     @Required() @BodyParams("cid") contestID: string,
                     @Req() request: Express.Request,
                     @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID,
            contestID: contestID
        }); 
    }

    @Post("/:id/submissions")
    @Summary("Add a submission")
    @Authenticated()
    async addSubmission(@Required() @PathParams("id") teamID: string,
                        @Required() @BodyParams("sid") submissionID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID,
            submissionID: submissionID
        }); 
    }

    @Delete("/:id/members/:uid")
    @MergeParams()
    @Summary("Delete a user from the team")
    @Authenticated()
    async deleteTeamMember(@Required() @PathParams("id") teamID: string,
                           @Required() @PathParams("uid") userID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            teamID: teamID,
            userID: userID
        }); 
    }
}