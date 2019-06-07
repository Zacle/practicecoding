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
import { Groups } from "../../../models/Groups";
import { GroupsService } from "../../../services/group/Groups.service";


@Controller("/groups")
export class GroupsCtrl {

    constructor(private groups: GroupsService) {}

    @Get("/")
    @Summary("Get all groups that are public")
    @Authenticated({role: 'admin'})
    async getAllGroups(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getAllGroups();
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body);
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
    @Authenticated()
    async getGroups(@Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getGroups(request.user._id);
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
                   @Required() @BodyParams("access") access: string,
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
                      @BodyParams("access") access: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.updateGroup(groupID, access.toUpperCase(), request.user._id);
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
     * Contests organized by this group
     * @param groupID 
     * @param request 
     * @param response 
     */
    @Get("/:id/contests")
    @Summary("Get group contests")
    @Authenticated()
    async getGroupContests(@Required() @PathParams("id") groupID: string,
                          @Req() request: Express.Request,
                          @Res() response: Express.Response) {
        return new Promise<Groups>(async (resolve, reject) => {

            let result: InsightResponse;

            try {
                result = await this.groups.getGroupContests(groupID);
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

    @Delete("/:id/members/:uid")
    @Summary("Delete a user from the group")
    @Authenticated()
    async deleteGroupMember(@Required() @PathParams("id") groupID: string,
                           @Required() @PathParams("uid") userID: string,
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