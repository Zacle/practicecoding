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
    QueryParams
} from "@tsed/common";
import { Plateform, AllPlateforms } from "../../../services/plateform/Plateform.service";
import PlateformBuilding from "../../../services/plateformBuilder/PlateformBuilding.service";
import { Summary } from "@tsed/swagger";
import * as Express from "express";
import { Problems } from "../../../models/Problems";
import { InsightResponse } from "../../../interfaces/InterfaceFacade";
import { BadRequest } from "ts-httpexceptions";

/*
 * REST end-point to access problems saved in our database
*/
@Controller("/problems")
export class ProblemsCtrl {

    constructor(private plateformB: PlateformBuilding, private allPlateforms: AllPlateforms) {}

    @Post("/")
    @Summary("save all problems from Codeforces, Live Archive, Uva and save them in the database")
    @Authenticated({role: 'admin'})
    async save(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction
    ): Promise<Problems> {

        return new Promise<Problems>(async (resolve, reject) => {
            let plat: Plateform = this.plateformB.createPlateform("all");

            let res: InsightResponse;
    
            try {
                res = await plat.getListOfProblems();
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch(err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        });
    }

    @Get("/")
    @Summary("get all problems from Codeforces, Live Archive, Uva and save them in the database")
    @Authenticated({role: 'admin'})
    async getAllProblems(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction
    ): Promise<Problems> {

        return new Promise<Problems>(async (resolve, reject) => {

            let res: InsightResponse;
    
            try {
                res = await this.allPlateforms.getAllProblems();
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch(err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        });
    }

    @Get("/:key")
    @Summary("Select all problems matching the key")
    async get(
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction,
        @PathParams("key") @Required() key: string,
        @BodyParams("plateform") @Required() plateform: string
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
        @PathParams("difficulty") @Required() difficulty: string,
        @QueryParams("plateform") @Required() plateform: string
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