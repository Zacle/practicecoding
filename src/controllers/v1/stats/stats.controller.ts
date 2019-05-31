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

@Controller("/stats")
export class StatsCtrl {

    @Get("/:id")
    @Summary("Get user")
    async getStats(@Required() @PathParams("id") userID: string, @Req() request: Express.Request, @Res() response: Express.Response) {
        response.status(HTTPStatusCodes.NOT_IMPLEMENTED);
        response.setHeader("Content-Type", "application/json");
        response.json({
            userID: userID
        });
    }
}