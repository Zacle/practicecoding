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
import { InsightResponse } from "../../../interfaces/InterfaceFacade";
import {Summary} from "@tsed/swagger";
import { AllPlateforms } from "../../../services/plateform/Plateform.service";

@Controller("/stats")
export class StatsCtrl {

    constructor(private allPlateforms: AllPlateforms) {}

    @Get("/:username")
    @Summary("Get user")
    async getStats(@Required() @PathParams("username") username: string, @Req() request: Express.Request, @Res() response: Express.Response) {
        return new Promise<any>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.allPlateforms.getUserStatistic(username);
                response.status(result.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(result.body.result);
                resolve();
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject();
            }
        });
    }
}