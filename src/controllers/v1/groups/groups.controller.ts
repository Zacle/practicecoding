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


@Controller("/groups")
export class GroupsCtrl {

    @Get("/")
    @Summary("Get all groups")
    @Authenticated()
    async getGroups(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("GET /groups");
    }

    @Post("/")
    @Summary("Add a new group")
    @Authenticated()
    async addGroup(@Required() @BodyParams("name") name: string,
                   @Required() @BodyParams("access") access: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            name: name,
            access: access
        });
    }

    @Delete("/")
    @Summary("Delete all groups")
    @Authenticated({role: 'admin'})
    async deleteGroups(@Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "plain/text");
        response.send("DELETE /groups");
    }

    @Get("/:id")
    @Summary("Get a specific group")
    @Authenticated()
    async getGroup(@Required() @PathParams("id") groupID: string,
                   @Req() request: Express.Request,
                   @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID
        });
    }

    @Put("/:id")
    @Summary("Update a specific group")
    @Authenticated()
    async updateGroup(@Required() @PathParams("id") groupID: string,
                      @BodyParams("access") access: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID,
            access: access
        });
    }

    @Delete("/:id")
    @Summary("Delete a group")
    @Authenticated()
    async deleteGroup(@Required() @PathParams("id") groupID: string,
                      @Req() request: Express.Request,
                      @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID
        });
    }

    @Get("/:id/members")
    @Summary("Get group members")
    @Authenticated()
    async getGroupMembers(@Required() @PathParams("id") groupID: string,
                         @Req() request: Express.Request,
                         @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID
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
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID
        });
    }

    @Get("/:id/submissions")
    @Summary("Get group submissions")
    @Authenticated()
    async getGroupSubmissions(@Required() @PathParams("id") groupID: string,
                             @Req() request: Express.Request,
                             @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID
        });
    }

    @Post("/:id/members")
    @Summary("Add a user to the group")
    @Authenticated()
    async addGroupMember(@Required() @PathParams("id") groupID: string,
                        @Required() @BodyParams("uid") userID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID,
            userID: userID
        });
    }

    /**
     * Add a contest the group has organized
     * @param groupID 
     * @param contestID 
     * @param request 
     * @param response 
     */
    @Post("/:id/contests")
    @Summary("Add a group contest")
    @Authenticated()
    async addGroupContest(@Required() @PathParams("id") groupID: string,
                     @Required() @BodyParams("cid") contestID: string,
                     @Req() request: Express.Request,
                     @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID,
            contestID: contestID
        });
    }

    @Post("/:id/submissions")
    @Summary("Add a submission")
    @Authenticated()
    async addGroupSubmission(@Required() @PathParams("id") groupID: string,
                        @Required() @BodyParams("sid") submissionID: string,
                        @Req() request: Express.Request,
                        @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID,
            submissionID: submissionID
        });
    }

    @Delete("/:id/members/:uid")
    @Summary("Delete a user from the group")
    @Authenticated()
    async deleteGroupMember(@Required() @PathParams("id") groupID: string,
                           @Required() @PathParams("uid") userID: string,
                           @Req() request: Express.Request,
                           @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            groupID: groupID,
            userID: userID
        });
    }
}