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
    MergeParams
} from "@tsed/common";
import { Plateform, Codeforces } from "../../../services/plateform/Plateform.service";
import PlateformBuilding from "../../../services/plateformBuilder/PlateformBuilding.service";
import { Summary } from "@tsed/swagger";
import * as Express from "express";
import { HTTPStatusCodes } from "../../../util/httpCode";
import { InsightResponse } from "../../../interfaces/InterfaceFacade";
import { BadRequest } from "ts-httpexceptions";

/*
 * REST end-point to access problems saved in our database
*/
@Controller("/problems")
export class ProblemsCtrl {

    constructor(private plateform: Plateform, private plateformB: PlateformBuilding) {}

    @Post("/")
    @Summary("Get all problems from Codeforces, Live Archive, Uva and save them in the database")
    @Authenticated({role: 'admin'})
    async save(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction
    ): Promise<void> {

        let plat: Plateform = this.plateformB.createPlateform("all");

        let res: InsightResponse;

        try {
            res = await plat.getListOfProblems();
            response.status(res.code);
            response.setHeader('Content-Type', 'application/json');
            response.json(res.body.result);
        }
        catch(err) {
            throw new BadRequest(err);
        }
    }

    @Get("/:key")
    @Summary("Select all problems matching the key")
    async get(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction,
        @PathParams("key") @Required() key: string
    ): Promise<void> {

        let plat: Plateform = this.plateformB.createPlateform("all");

        let res: InsightResponse;

        try {
            res = await plat.getProblems(key);
            response.status(res.code);
            response.setHeader('Content-Type', 'application/json');
            response.json(res.body.result);
        }
        catch(err) {
            throw new BadRequest(err);
        }

    }

    @Get("/:key/:plateform")
    @MergeParams()
    @Summary("Select all problems matching the key in the specified platform")
    async getPlateform(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction,
        @PathParams("key") @Required() key: string,
        @PathParams("plateform") @Required() plateform: string
    ): Promise<void> {

        let plat: Plateform = this.plateformB.createPlateform(plateform);

        let res: InsightResponse;

        try {
            res = await plat.getProblems(key);
            response.status(res.code);
            response.setHeader('Content-Type', 'application/json');
            response.json(res.body.result);
        }
        catch(err) {
            throw new BadRequest(err);
        }

    }

    @Get("/p/filter/:difficulty")
    @Summary("Filter all problems by difficulty")
    async filter(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction,
        @PathParams("difficulty") @Required() difficulty: string
    ): Promise<void> {

        let plat: Plateform = this.plateformB.createPlateform("all");

        let res: InsightResponse;

        try {
            res = await plat.getProblemsFiltered(difficulty);
            response.status(res.code);
            response.setHeader('Content-Type', 'application/json');
            response.json(res.body.result);
        }
        catch(err) {
            throw new BadRequest(err);
        }

    }

    @Get("/p/filter/:difficulty/:plateform")
    @MergeParams()
    @Summary("Filter all problems by difficulty in the specified platform")
    async filterPlateform(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction,
        @PathParams("difficulty") @Required() difficulty: string,
        @PathParams("plateform") @Required() plateform: string
    ): Promise<void> {

        let plat: Plateform = this.plateformB.createPlateform(plateform);

        let res: InsightResponse;

        try {
            res = await plat.getProblemsFiltered(difficulty);
            response.status(res.code);
            response.setHeader('Content-Type', 'application/json');
            response.json(res.body.result);
        }
        catch(err) {
            throw new BadRequest(err);
        }

    }
}