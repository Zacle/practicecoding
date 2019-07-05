import {
    Authenticated,
    BodyParams,
    Controller,
    Get,
    PathParams,
    QueryParams,
    Post,
    Req,
    Res,
    Required,
    MergeParams,
    Delete,
    Put
} from "@tsed/common";
import * as Express from "express";
import { InsightResponse, ContestType, AccessType, IContest } from "../../../interfaces/InterfaceFacade";
import {Summary} from "@tsed/swagger";
import { Submissions } from "../../../models/contests/Submissions";
import { Contests } from "../../../models/contests/Contests";
import ContestBuilderService from "../../../services/contest/ContestBuilder.service";
import { ContestsService } from "../../../services/contest/Contests.service";
import { Problems } from "../../../models/Problems";

/**
 * REST end-point for contests
 */

@Controller("/contests")
export class ContestsCtrl {

    constructor(private contestBuilder: ContestBuilderService,
                private contestService: ContestsService) {}

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
                 @Required() @BodyParams("startDateYear") startDateYear: number,
                 @Required() @BodyParams("startDateMonth") startDateMonth: number,
                 @Required() @BodyParams("startDateDay") startDateDay: number,
                 @Required() @BodyParams("endDateYear") endDateYear: number,
                 @Required() @BodyParams("endDateMonth") endDateMonth: number,
                 @Required() @BodyParams("endDateDay") endDateDay: number,
                 @BodyParams("startTimeHour") startTimeHour: number,
                 @BodyParams("startTimeMinute") startTimeMinute: number,
                 @BodyParams("endTimeHour") endTimeHour: number,
                 @BodyParams("endTimeMinute") endTimeMinute: number,
                 @Required() @BodyParams("access") access: string,
                 @Required() @BodyParams("type") type: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contestType: ContestType;
            let accessType: AccessType;
            if (type.toUpperCase() == "TEAM") {
                contestType = ContestType.TEAM;
            }
            else {
                contestType = ContestType.INDIVIDUAL;
            }
            if (access.toUpperCase() == "PRIVATE") {
                accessType = AccessType.PRIVATE;
            }
            else {
                accessType = AccessType.PUBLIC;
            }
            let contest: IContest = {
                name: name,
                startDateYear: startDateYear,
                startDateMonth: startDateMonth,
                startDateDay: startDateDay,
                endDateYear: endDateYear,
                endDateMonth: endDateMonth,
                endDateDay: endDateDay,
                startTimeHour: startTimeHour,
                startTimeMinute: startTimeMinute,
                endTimeHour: endTimeHour,
                endTimeMinute: endTimeMinute,
                access: accessType,
                owner: request.user._id
            };
            let contests: ContestsService = this.contestBuilder.createContest(contestType);

            try {
                result = await contests.create(contest, request.user._id);
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

    /**
     * Return all coming contests
     * @param request 
     * @param response 
     */
    @Get("/coming")
    @Summary("Get all coming public contests")
    async getAllComingContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.getAllComingContests();
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

    /**
     * Return all running contests
     * @param request 
     * @param response 
     */
    @Get("/running")
    @Summary("Get all running public contests")
    async getAllRunningContests(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.getAllRunningContests();
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

    /**
     * Return some past contests
     * @param request 
     * @param response 
     */
    @Get("/past")
    @Summary("Get some past public contests")
    async getSomePastContests(@Req() request: Express.Request, @Res() response: Express.Response, @QueryParams("page") page: number) {
        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.getPastContests(page);
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

    @Get("/my")
    @Summary("Contests attended by the user")
    @Authenticated()
    async getContests(@Req() request: Express.Request, @Res() response: Express.Response, @QueryParams("username") username: string) {
        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.getContests(username);
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

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.getContest(contestID);
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
    @Authenticated()
    @Summary("Update contest info")
    async updateContest(@BodyParams("startDateYear") startDateYear: number,
                        @BodyParams("startDateMonth") startDateMonth: number,
                        @BodyParams("startDateDay") startDateDay: number,
                        @BodyParams("endDateYear") endDateYear: number,
                        @BodyParams("endDateMonth") endDateMonth: number,
                        @BodyParams("endDateDay") endDateDay: number,
                        @BodyParams("startTimeHour") startTimeHour: number,
                        @BodyParams("startTimeMinute") startTimeMinute: number,
                        @BodyParams("endTimeHour") endTimeHour: number,
                        @BodyParams("endTimeMinute") endTimeMinute: number,
                        @BodyParams("access") access: string,
                        @BodyParams("type") type: string,
                        @Required() @PathParams("id") contestID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contestType: ContestType;
            let accessType: AccessType;
            let isAccess = false;
            if (access) {
                isAccess = true;
                if (access.toUpperCase() == "PRIVATE") {
                    accessType = AccessType.PRIVATE;
                }
                else {
                    accessType = AccessType.PUBLIC;
                }
            }
            let contest: IContest = {
                name: "",
                startDateYear: startDateYear,
                startDateMonth: startDateMonth,
                startDateDay: startDateDay,
                endDateYear: endDateYear,
                endDateMonth: endDateMonth,
                endDateDay: endDateDay,
                startTimeHour: startTimeHour,
                startTimeMinute: startTimeMinute,
                endTimeHour: endTimeHour,
                endTimeMinute: endTimeMinute,
                access: accessType,
                owner: request.user._id
            };

            try {
                result = await this.contestService.updateContest(contest, contestID, isAccess);
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
    @Summary("Delete a specific contest")
    @Authenticated()
    async deletecontest(@Required() @PathParams("id") contestID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.deleteContest(contestID, request.user._id);
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

    @Get("/:id/submissions")
    @Summary("Get contest submissions")
    async getContestSubmissions(@Required() @PathParams("id") contestID: string,
                                @QueryParams("page") page: number,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        return new Promise<Submissions>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;

            try {
                result = await this.contestService.getContestType(contestID);
                contest = this.contestBuilder.createContest(result.body.result);
                result = await contest.getSubmissions(contestID, page);
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
        });
    }

    @Get("/:id/problems")
    @Summary("Get contest problems")
    async getContestProblems(@Required() @PathParams("id") contestID: string,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.getProblems(contestID);
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

    @Get("/:id/registrants")
    @Summary("Get contest registrants")
    async getContestRegistrants(@Required() @PathParams("id") contestID: string,
                                @QueryParams("page") page: number,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        return new Promise<Submissions>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;

            try {
                result = await this.contestService.getContestType(contestID);
                contest = this.contestBuilder.createContest(result.body.result);
                result = await contest.getRegistrants(contestID, page);
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
        });
    }

    @Get("/:id/standing")
    @Summary("Get contest standing")
    async getContestStanding(@Required() @PathParams("id") contestID: string,
                             @QueryParams("page") page: number,
                             @Req() request: Express.Request,
                             @Res() response : Express.Response) {

        return new Promise<Submissions>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;

            try {
                result = await this.contestService.getContestType(contestID);
                contest = this.contestBuilder.createContest(result.body.result);
                result = await contest.getStanding(contestID, page);
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
        });
    }

    @Get("/:id/update")
    @Summary("Update contest standing")
    async updateContestStanding(@Required() @PathParams("id") contestID: string,
                                @Req() request: Express.Request,
                                @Res() response : Express.Response) {

        return new Promise<Submissions>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;

            try {
                result = await this.contestService.getContestType(contestID);
                contest = this.contestBuilder.createContest(result.body.result);
                result = await contest.updateStanding(contestID);
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
        });
    }

    /**
     * Add specific problem to the the contest only by the contest owner 
     * @param contestID 
     * @param problem 
     * @param request 
     * @param response 
     */
    @Post("/:id/specificproblem")
    @Summary("Add problems to the contest")
    @Authenticated()
    async addSpecificProblems(@Required() @PathParams("id") contestID: string,
                      @Required() @BodyParams("problem") problem: Problems,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.addSpecificProblem(contestID, problem, request.user._id);
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

    /**
     * Add problems from a codeforces contest 
     * @param contestID 
     * @param problem 
     * @param request 
     * @param response 
     */
    @Post("/:id/codeforcecontest")
    @Summary("Add problems to the contest")
    @Authenticated()
    async addProblemsFromCodeforces(@Required() @PathParams("id") contestID: string,
                      @Required() @BodyParams("id") codeforceID: number,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.addProblemsFromCodeforces(contestID, codeforceID, request.user._id);
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

    /**
     * Add problems from uva/uhunt contest
     * @param contestID 
     * @param problems 
     * @param request 
     * @param response 
     */
    @Post("/:id/uvacontest")
    @Summary("Add problems to the contest")
    @Authenticated()
    async addProblemsFromUva(@Required() @PathParams("id") contestID: string,
                      @Required() @BodyParams("problem") problems: number[],
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.addProblemsFromUVA(contestID, problems, request.user._id);
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

    /**
     * Add problems from an existing contest 
     * @param contestID 
     * @param existingID 
     * @param request 
     * @param response 
     */
    @Post("/:id/existingcontest")
    @Summary("Add problems to the contest")
    @Authenticated()
    async addProblemsFromExistingContest(@Required() @PathParams("id") contestID: string,
                      @Required() @BodyParams("id") existingID: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.addProblemsFromExisting(contestID, existingID, request.user._id);
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

    /**
     * Add random problems 
     * @param contestID 
     * @param quantity
     * @param plateform 
     * @param request 
     * @param response 
     */
    @Post("/:id/randomproblems")
    @Summary("Add problems to the contest")
    @Authenticated()
    async addRandomProblems(@Required() @PathParams("id") contestID: string,
                      @Required() @BodyParams("quantity") quantity: number,
                      @Required() @BodyParams("oj") plateform: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.addRandomProblems(contestID, quantity, request.user._id, plateform);
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

    /**
     * Register a user to the contest
     * @param contestID 
     * @param userID 
     * @param request 
     * @param response 
     */
    @Post("/:id/registerUser")
    @Summary("Register a user to the contest")
    @Authenticated()
    async registerUser(@Required() @PathParams("id") contestID: string,
                   @BodyParams("userID") userID: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;
            contest = this.contestBuilder.createContest(ContestType.INDIVIDUAL);

            try {
                result = await contest.register(contestID, userID);
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

    /**
     * Register a team to the contest
     * @param contestID 
     * @param teamID 
     * @param request 
     * @param response 
     */
    @Post("/:id/registerTeam")
    @Summary("Register a team to the contest")
    @Authenticated()
    async registerTeam(@Required() @PathParams("id") contestID: string,
                   @BodyParams("teamID") teamID: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;
            contest = this.contestBuilder.createContest(ContestType.TEAM);

            try {
                result = await contest.register(contestID, teamID);
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

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.contestService.removeProblem(contestID, problemID, request.user._id);
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

    /**
     * Delete a contest user
     * @param contestID 
     * @param userID
     * @param request 
     * @param response 
     */
    @Delete("/:id/unregisterUser")
    @Summary("Delete a contest registrant")
    @Authenticated()
    async unregisterUser(@Required() @PathParams("id") contestID: string,
                           @Required() @BodyParams("userID") userID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;
            contest = this.contestBuilder.createContest(ContestType.INDIVIDUAL);

            try {
                result = await contest.unregister(contestID, userID);
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

    /**
     * Delete a contest team
     * @param contestID 
     * @param teamID
     * @param request 
     * @param response 
     */
    @Delete("/:id/unregisterTeam")
    @MergeParams()
    @Summary("Delete a contest team")
    @Authenticated()
    async unregisterTeam(@Required() @PathParams("id") contestID: string,
                           @Required() @BodyParams("teamID") teamID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {

        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contest: ContestsService;
            contest = this.contestBuilder.createContest(ContestType.TEAM);

            try {
                result = await contest.unregister(contestID, teamID);
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
