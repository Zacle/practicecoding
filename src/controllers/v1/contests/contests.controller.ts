import {
    Authenticated,
    BodyParams,
    Controller,
    Get,
    PathParams,
    Post,
    Req,
    Res,
    Required,
    MergeParams,
    Delete,
    Put
} from "@tsed/common";
import * as Express from "express";
import { HTTPStatusCodes } from "../../../util/httpCode";
import {Summary} from "@tsed/swagger";
import { Submissions } from "../../../models/contests/Submissions";

/**
 * REST end-point for contests
 */

@Controller("/contests")
export class ContestsCtrl {

    /**
     * End-point to create contests
     * @param name name of the contest
     * @param startDateYear start date year of the contest
     * @param startDateMonth start date month of the contest
     * @param startDateDay start date day of the contest
     * @param endDateYear end date year of the contest
     * @param endDateMonth end date month of the contest
     * @param endDateDay end date day of the contest
     * @param startTimeHour start time hour of the contest
     * @param startTimeMinute start time minute of the contest
     * @param endTimeHour end time hour of the contest
     * @param endTimeMinute end time minute of the contest
     * @param access public or private contest
     * @param type individual or team contest
     */
    @Post("/")
    @Summary("Create a contest")
    @Authenticated()
    async create(@Required() @BodyParams("name") name: string,
                 @Required() @BodyParams("startDateYear") startDateYear: Date,
                 @Required() @BodyParams("startDateMonth") startDateMonth: Date,
                 @Required() @BodyParams("startDateDay") startDateDay: Date,
                 @Required() @BodyParams("endDateYear") endDateYear: Date,
                 @Required() @BodyParams("endDateMonth") endDateMonth: Date,
                 @Required() @BodyParams("endDateDay") endDateDay: Date,
                 @BodyParams("startTimeHour") startTimeHour: string,
                 @BodyParams("startTimeMinute") startTimeMinute: string,
                 @BodyParams("endTimeHour") endTimeHour: string,
                 @BodyParams("endTimeMinute") endTimeMinute: string,
                 @Required() @BodyParams("access") access: string,
                 @Required() @BodyParams("type") type: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            name: name
        });
    }

    /**
     * Return all coming contests
     * @param request 
     * @param response 
     */
    @Get("/coming")
    @Summary("Get all coming public contests")
    async getAllComingContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /contests");
    }

    /**
     * Return all running contests
     * @param request 
     * @param response 
     */
    @Get("/running")
    @Summary("Get all running public contests")
    async getAllRunningContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /contests");
    }

    /**
     * Return some past contests
     * @param request 
     * @param response 
     */
    @Get("/past")
    @Summary("Get some past public contests")
    async getSomePastContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /contests");
    }

    @Get("/my")
    @Summary("Contests attended by the user")
    @Authenticated()
    async getContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /contests/my");
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
     * @param startDateYear start date year of the contest
     * @param startDateMonth start date month of the contest
     * @param startDateDay start date day of the contest
     * @param endDateYear end date year of the contest
     * @param endDateMonth end date month of the contest
     * @param endDateDay end date day of the contest
     * @param startTimeHour start time hour of the contest
     * @param startTimeMinute start time minute of the contest
     * @param endTimeHour end time hour of the contest
     * @param endTimeMinute end time minute of the contest
     * @param access 
     * @param type 
     * @param contestID 
     */
    @Put("/:id")
    @Summary("Update contest info")
    async updateContest(@BodyParams("startDateYear") startDateYear: Date,
                        @BodyParams("startDateMonth") startDateMonth: Date,
                        @BodyParams("startDateDay") startDateDay: Date,
                        @BodyParams("endDateYear") endDateYear: Date,
                        @BodyParams("endDateMonth") endDateMonth: Date,
                        @BodyParams("endDateDay") endDateDay: Date,
                        @BodyParams("startTimeHour") startTimeHour: string,
                        @BodyParams("startTimeMinute") startTimeMinute: string,
                        @BodyParams("endTimeHour") endTimeHour: string,
                        @BodyParams("endTimeMinute") endTimeMinute: string,
                        @BodyParams("access") access: string,
                        @BodyParams("type") type: string,
                        @Required() @PathParams("id") contestID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            name: name,
            access: access,
            type: type,
            contestID: contestID
        });
    }

    @Delete("/:id")
    @Summary("Delete a specific contest")
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

    @Get("/:id/update")
    @Summary("Update contest standing")
    async updateContestStanding(@Required() @PathParams("id") contestID: string,
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
                      @Required() @BodyParams("id") problemID: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            contestID: contestID,
            problem: problemID
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
