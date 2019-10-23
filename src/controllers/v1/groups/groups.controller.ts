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
import { InsightResponse, ContestType, AccessType, IContest } from "../../../interfaces/InterfaceFacade";
import {Summary} from "@tsed/swagger";
import { Groups } from "../../../models/Groups";
import { GroupsService } from "../../../services/group/Groups.service";
import ContestBuilderService from "../../../services/contest/ContestBuilder.service";
import { ContestsService } from "../../../services/contest/Contests.service";
import { Contests } from "../../../models/contests/Contests";


@Controller("/groups")
export class GroupsCtrl {

    constructor(private groups: GroupsService,
                private contestBuilder: ContestBuilderService,
                private contestService: ContestsService) {}

    @Get("/")
    @Summary("Get all groups that are public")
    async getAllGroups(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getAllGroups();
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve();
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
    @Summary("Get all groups that contain the user")
    async getGroups(@Req() request: Express.Request, @Res() response: Express.Response,
                    @Required() @QueryParams("username") username: string) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getGroups(username);
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

    @Post("/")
    @Summary("Add a new group")
    @Authenticated()
    async addGroup(@Required() @BodyParams("name") name: string,
                   @BodyParams("access") access: string = "PUBLIC",
                   @BodyParams("description") description: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.createGroup(name, request.user._id, access.toUpperCase(), description);
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
    @Summary("Delete all groups")
    @Authenticated({role: 'admin'})
    async deleteGroups(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.deleteAllGroups();
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
    @Summary("Get a specific group")
    @Authenticated()
    async getGroup(@Required() @PathParams("id") groupID: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getGroup(groupID);
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

    @Get("/by/:name")
    @Summary("Get a specific group by name")
    @Authenticated()
    async getGroupName(@Required() @PathParams("name") name: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getGroupName(name);
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

    @Put("/:id")
    @Summary("Update a specific group")
    @Authenticated()
    async updateGroup(@Required() @PathParams("id") groupID: string,
                      @BodyParams("description") description: string,
                      @BodyParams("access") access: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.updateGroup(groupID, access.toUpperCase(), request.user._id, description);
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
    @Summary("Delete a group")
    @Authenticated()
    async deleteGroup(@Required() @PathParams("id") groupID: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.deleteGroup(groupID, request.user._id);
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
    @Summary("Get group members")
    @Authenticated()
    async getGroupMembers(@Required() @PathParams("id") groupID: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getGroupMembers(groupID);
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
     * End-point to create contests for a group
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
     * @param type individual or team contest
     */
    @Post("/:id/createcontest")
    @Summary("Create a contest")
    @Authenticated()
    async createContest(@Required() @BodyParams("name") name: string,
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
                 @Required() @BodyParams("type") type: string,
                 @Required() @PathParams("id") groupID: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {
        
        return new Promise<Contests>(async (resolve, reject) => {
            let result: InsightResponse;
            let contestType: ContestType;
            if (type.toUpperCase() == "TEAM") {
                contestType = ContestType.TEAM;
            }
            else {
                contestType = ContestType.INDIVIDUAL;
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
                access: AccessType.PRIVATE,
                owner: request.user._id
            };
            let contests: ContestsService = this.contestBuilder.createContest(contestType);

            try {
                result = await contests.createGroupContest(contest, groupID, request.user._id);
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
     * Coming Contests of this group
     * @param groupID 
     * @param request 
     * @param response 
     */
    @Get("/:id/comingcontests")
    @Summary("Get group contests")
    @Authenticated()
    async getGroupComingContests(@Required() @PathParams("id") groupID: string,
                          @Req() request: Express.Request,
                          @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getComingContests(groupID);
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
     * Running Contests of this group
     * @param groupID 
     * @param request 
     * @param response 
     */
    @Get("/:id/runningcontests")
    @Summary("Get group contests")
    @Authenticated()
    async getGroupRunningContests(@Required() @PathParams("id") groupID: string,
                          @Req() request: Express.Request,
                          @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getRunningContests(groupID);
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
     * Past Contests of this group
     * @param groupID 
     * @param request 
     * @param response 
     */
    @Get("/:id/pastcontests")
    @Summary("Get group contests")
    @Authenticated()
    async getGroupPastContests(@Required() @PathParams("id") groupID: string,
                          @Req() request: Express.Request,
                          @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getContests(groupID);
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
    @Summary("Add a user to the group")
    @Authenticated()
    async addGroupMember(@Required() @PathParams("id") groupID: string,
                        @Required() @BodyParams("uid") userID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.addGroupMember(groupID, userID);
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

    @Delete("/:id/members/")
    @Summary("Delete a user from the group")
    @Authenticated()
    async deleteGroupMember(@Required() @PathParams("id") groupID: string,
                           @Required() @QueryParams("uid") userID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.deleteGroupMember(groupID, userID);
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