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
import { Problems } from "../../../models/Problems";
import { Submissions } from "../../../models/contests/Submissions";

/**
 * REST end-point for contests
 */

@Controller("/contests")
export class ContestsCtrl {

    /**
     * End-point to create contests
     * @param name name of tghe contest
     * @param startDate start date of the contest
     * @param endDate end date of the contest
     * @param startTime start time of the contest
     * @param endTime end time of the contest
     * @param access public or private contest
     * @param type individual or team contest
     */
    @Post("/")
    @Summary("Create a contest")
    @Authenticated()
    async create(@Required() @BodyParams("name") name: string,
                 @Required() @BodyParams("startDate") startDate: Date,
                 @Required() @BodyParams("endDate") endDate: Date,
                 @Required() @BodyParams("startTime") startTime: string,
                 @Required() @BodyParams("endTime") endTime: string,
                 @Required() @BodyParams("access") access: string,
                 @Required() @BodyParams("type") type: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            name: name,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            access: access,
            type: type
        });
    }

    /**
     * Return all contests
     * @param request 
     * @param response 
     */
    @Get("/")
    @Summary("Get all contests")
    async getContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /contests");
    }

    /**
     * Delete all contests
     * @param request 
     * @param response 
     */
    @Delete("/")
    @Summary("Delete all contests")
    @Authenticated({role: "admin"})
    async deleteContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("DELETE /contests");
    }

    /**
     * Return a specific contest identified by its ID
     * @param constestID 
     * @param request 
     * @param response 
     */
    @Get("/:id")
    @Summary("Get a specific contest")
    async getContest(@Required() @PathParams("id") contestID: string,
                     @Req() request: Express.Request,
                     @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    /**
     * Update contest info
     * @param startDate 
     * @param endDate 
     * @param startTime 
     * @param endTime 
     * @param access 
     * @param type 
     * @param contestID 
     */
    @Put("/:id")
    @Summary("Update contest info")
    async updateContest(@BodyParams("startDate") startDate: Date,
                        @BodyParams("endDate") endDate: Date,
                        @BodyParams("startTime") startTime: string,
                        @BodyParams("endTime") endTime: string,
                        @BodyParams("access") access: string,
                        @BodyParams("type") type: string,
                        @Required() @PathParams("id") contestID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            name: name,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            access: access,
            type: type,
            contestID: contestID
        });
    }

    @Delete("/:id")
    @Summary("Delete  aspecific contest")
    @Authenticated()
    async deletecontest(@Required() @PathParams("id") contestID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    @Get("/:id/submissions")
    @Summary("Get contest submissions")
    async getContestSubmissions(@Required() @PathParams("id") contestID: string,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    @Get("/:id/problems")
    @Summary("Get contest problems")
    async getContestProblems(@Required() @PathParams("id") contestID: string,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    @Get("/:id/registrants")
    @Summary("Get contest registrants")
    async getContestRegistrants(@Required() @PathParams("id") contestID: string,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    @Get("/:id/standing")
    @Summary("Get contest standing")
    async getContestStanding(@Required() @PathParams("id") contestID: string,
                             @Req() request: Express.Request,
                             @Res() response : Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    /**
     * Add problems to the the contest only by the contest owner 
     * @param contestID 
     * @param problem 
     * @param request 
     * @param response 
     */
    @Post("/:id/problems")
    @Summary("Add problems to the contest")
    @Authenticated()
    async addProblems(@Required() @PathParams("id") contestID: string,
                      @Required() @BodyParams("problem") problem: Problems,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID,
            problem: problem
        });
    }

    /**
     * Register a user to the contest
     * @param contestID 
     * @param userID 
     * @param teamID 
     * @param request 
     * @param response 
     */
    @Post("/:id/registrants")
    @Summary("Register a user or a team to the contest")
    @Authenticated()
    async register(@Required() @PathParams("id") contestID: string,
                   @BodyParams("userID") userID: string,
                   @BodyParams("teamID") teamID: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID,
            userID: userID,
            teamID: teamID
        });

    }

    @Post("/:id/submissions")
    @Summary("Add a submissions")
    async addSubmissions(@Required() @PathParams("id") contestID: string,
                         @Required() @BodyParams("submission") submission: Submissions,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    /**
     * Delete all contest problems
     * @param contestID 
     * @param request 
     * @param response 
     */
    @Delete("/:id/problems")
    @Summary("Delete all contest problems")
    @Authenticated()
    async deleteProblems(@Required() @PathParams("id") contestID: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    /**
     * Delete all contest submissions
     * @param contestID 
     * @param request 
     * @param response 
     */
    @Delete("/:id/submissions")
    @Summary("Delete all contest submissions")
    @Authenticated()
    async deleteSubmissions(@Required() @PathParams("id") contestID: string,
                            @Req() request: Express.Request,
                            @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }

    /**
     * Delete all contest registrants (users or teams)
     * @param contestID 
     * @param request 
     * @param response 
     */
    @Delete("/:id/registrants")
    @Summary("Delete all contest registrants")
    @Authenticated()
    async deleteRegistrants(@Required() @PathParams("id") contestID: string,
                            @Req() request: Express.Request,
                            @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID
        });
    }
    
    /**
     * Delete a contest problem
     * @param contestID 
     * @param problemID
     * @param request 
     * @param response 
     */
    @Delete("/:id/problems/:pid")
    @MergeParams()
    @Summary("Delete a contest problem")
    @Authenticated()
    async deleteProblem(@Required() @PathParams("id") contestID: string,
                        @Required() @PathParams("pid") problemID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID,
            problemID: problemID
        });
    }

    /**
     * Delete a contest submission
     * @param contestID 
     * @param submissionID
     * @param request 
     * @param response 
     */
    @Delete("/:id/submissions/:sid")
    @MergeParams()
    @Summary("Delete a contest submission")
    @Authenticated()
    async deleteSubmission(@Required() @PathParams("id") contestID: string,
                           @Required() @PathParams("sid") submissionID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID,
            submissionID: submissionID
        });
    }

    /**
     * Delete a contest registrant (user or team)
     * @param contestID 
     * @param registrantID
     * @param request 
     * @param response 
     */
    @Delete("/:id/registrants/:rid")
    @MergeParams()
    @Summary("Delete a contest registrant")
    @Authenticated()
    async deleteRegistrant(@Required() @PathParams("id") contestID: string,
                           @Required() @PathParams("rid") registrantID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID,
            registrantID: registrantID
        });
    }
}
