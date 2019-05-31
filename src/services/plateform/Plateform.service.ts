import { Inject , Service } from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import * as fs from "fs";
import { IProblem, PlateformFactory, UserStatistic, PlateformName } from "../../interfaces/InterfaceFacade";
import { InsightResponse, InsightResponseSuccessBody, InsightResponseErrorBody } from "../../interfaces/InterfaceFacade";
import Log from "../../Util";
import { Problem } from "../Problem.service";
import { Problems } from "../../models/Problems";
import request = require("request-promise");
import { HTTPStatusCodes } from "../../util/httpCode";



/*
 *  Define the plateform superclass that will serve as a base
 *  class for all plateform
 *  Fields:
 *      - plateformFactory: name of the plateform to search for the query
 *      - listOfProblems: list of problems matching the current query
 *      - userStat: statistic of the user on a particular plateform
*/
@Service()
export abstract class Plateform implements PlateformFactory {    

    constructor(@Inject(Problems) private problems: MongooseModel<Problems>) {
        Log.trace("Plateform::init()");
    }

    abstract getPlateform(): string;

    abstract getUserStatistic(): Promise<InsightResponse>;

    abstract getProblems(key: string): Promise<InsightResponse>;

    abstract getListOfProblems(): Promise<InsightResponse>;

    abstract getProblemsFiltered(level: string): Promise<InsightResponse>;

    /**
     * Wraps writeFile in a promise.
     * @param link The link of the API to get all problems.
     */
    abstract async readAPI(link: string): Promise<any>;
    
}

@Service()
export class Codeforces extends Plateform {    
    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>) {
        super(problemsModel);
        Log.trace("Codeforces::init()");
    }

    /**
     * Return all Codeforces problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        try {
            problems = await this.problemsModel.find({
                                "plateform": this.getPlateform(),
                                "name": {
                                    "$regex": key,
                                    "$options": "i"
                                }
                            }).exec();
        }
        catch(err) {
            return  Promise.reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Codeforces"
                        }
                    });
        }

        console.log("RESULTTTTT: ", problems.length);

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: problems
            }
        };
    }

    /**
     * Get all problems from Codeforces website using their api
     * @returns {Promise<InsightResponse>}
     */
    async getListOfProblems(): Promise<InsightResponse> {
        const path: string = "https://codeforces.com/api/problemset.problems";
        let res: any[] = [];
        let ans: any[] = [];

        this.problemsModel.find({}).remove().exec();

        try {

            let promise: any = await this.readAPI(path);

            let i: number = 0;

            promise.problems.forEach(async (problem: any) => {

                let diff: string;

                if (problem.rating) {
                    if (problem.rating <= 1300)
                        diff = "easy";
                    else if (problem.rating <= 2000)
                        diff = "medium";
                    else
                        diff = "hard";
                }
                else {
                    diff = "medium";
                }

                let result: Problems = {
                    "problemID": problem.contestId + "" + problem.index,
                    "name": problem.index + ". " + problem.name,
                    "plateform": "Codeforces",
                    "link": `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
                    "difficulty": diff
                };

                console.log(result);

                res.push(result);
            });
            console.log("OUTSIDE");
            console.log("SiZEEEE: ", res.length);
        }
        catch(err) {
            return Promise.reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Can't get problems from Codeforces"
                    }
            });
        }

        try {
            await this.problemsModel.create(res);

            ans = await this.problemsModel
                        .find({})
                        .exec();
        }
        catch(err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "Can't get problems from Codeforces"
                }
            });
        }
        
        console.log("RESULTTTTT: ", ans.length);

        return {
            code: HTTPStatusCodes.CREATED,
            body : {
                result: ans
            }
        };
    }

    /**
     * Wraps writeFile in a promise.
     * @param link The link of the API to get all problems.
     */
    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING Codeforces READ API");

        let res: any = {};

        let options = {
            uri: link,
            json: true
        };

        await request(options)
            .then((body) => {
                if (body.status === "FAILED") {
                    throw new Error(body.comment);
                }
                console.log("BEFOOORE: ", body.result.problems.length);
                res = body.result;
            })
            .catch((err) => {
                throw new Error(err);
            });
        return res;
    }
    
    /**
     * Return Codeforces problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    async getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        try {
            problems = await this.problemsModel.find({
                                "plateform": this.getPlateform(),
                                "difficulty": level
                            }).exec();
        }
        catch(err) {
            return  Promise.reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Codeforces"
                        }
                    });
        }

        console.log("RESULTTTTT: ", problems.length);

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: problems
            }
        };
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): string {
        
        return "Codeforces";

    }
}

@Service()
export class Uva extends Plateform {

    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>) {
        super(problemsModel);
        Log.trace("Uva::init()");
    }
    
    /**
     * Return all Uva problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        try {
            problems = await this.problemsModel.find({
                                "plateform": this.getPlateform(),
                                "name": {
                                    "$regex": key,
                                    "$options": "i"
                                }
                            }).exec();
        }
        catch(err) {
            return  Promise.reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Codeforces"
                        }
                    });
        }

        console.log("RESULTTTTT: ", problems.length);

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: problems
            }
        };
    }
    
    private getDifficulty(accepted: number, total: number): string {
        let diff: string;

        if (total === 0) {
            diff = "medium";
        }
        else {
            let solvedPercentage: number = (accepted / total) * 100;
            if (solvedPercentage >= 70) {
                diff = "easy";
            }
            else if (solvedPercentage >= 35) {
                diff = "medium";
            }
            else {
                diff = "hard";
            }
        }

        return diff;
    }

    private parseProblem(problem: any[], diff: string): Problems {

        let result: Problems = {
            "problemID": problem[0] + " " + problem[2],
            "name": problem[1] + " - " + problem[2],
            "plateform": "Uva",
            "link": `https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=${problem[0]}`,
            "difficulty": diff
        };

        return result;
    }

    /**
     * Get all problems from Uva website using uhunt api
     * @returns {Promise<InsightResponse>}
     */
    async getListOfProblems(): Promise<InsightResponse> {
        const path: string = "https://uhunt.onlinejudge.org/api/p";
        let res: any[] = [];
        let ans: any[] = [];

        try {

            let problem: any = await this.readAPI(path);

            for (let i: number = 0; i < problem.length; i += 1) {

                let diff: string;

                let accepted: number = problem[i][18];
                let wrong: number = problem[i][16];
                let total: number = (accepted + wrong);

                diff = this.getDifficulty(accepted, total);

                let result: Problems = this.parseProblem(problem[i], diff);

                console.log(result);

                res.push(result);
            }
        }
        catch(err) {
            return Promise.reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Can't get problems from Uva"
                    }
            });
        }

        try {
            await this.problemsModel.create(res);

            ans = await this.problemsModel
                    .find({})
                    .exec();
        }
        catch(err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "Can't get problems from Uva"
                }
            });
        }
        
        console.log("RESULTTTTT: ", ans.length);

        return {
            code: HTTPStatusCodes.CREATED,
            body : {
                result: ans
            }
        };
    }

    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING UVA READ API");

        let res: any;

        const options = {
            uri: link,
            json: true
        };

        await request(options)
            .then((body) => {
                console.log("BEFOOORE: ", body.length);
                res = body;
            })
            .catch((err) => {
                throw new Error(err);
            });
        return res;
    }
    
    /**
     * Return Uva problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    async getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        try {
            problems = await this.problemsModel.find({
                                "plateform": this.getPlateform(),
                                "difficulty": level
                            }).exec();
        }
        catch(err) {
            return  Promise.reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Uva"
                        }
                    });
        }

        console.log("RESULTTTTT: ", problems.length);

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: problems
            }
        };
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): string {
        
        return "Uva";
    
    }
}

@Service()
export class LiveArchive extends Plateform {

    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>) {
        super(problemsModel);
        Log.trace("LiveArchive::init()");
    }

    /**
     * Return all Live Archive problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        try {
            problems = await this.problemsModel.find({
                                "plateform": this.getPlateform(),
                                "name": {
                                    "$regex": key,
                                    "$options": "i"
                                }
                            }).exec();
        }
        catch(err) {
            return  Promise.reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Live Archive"
                        }
                    });
        }

        console.log("RESULTTTTT: ", problems.length);

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: problems
            }
        };
    }
    
    private getDifficulty(accepted: number, total: number): string {
        let diff: string;

        if (total === 0) {
            diff = "medium";
        }
        else {
            let solvedPercentage: number = (accepted / total) * 100;
            if (solvedPercentage >= 70) {
                diff = "easy";
            }
            else if (solvedPercentage >= 35) {
                diff = "medium";
            }
            else {
                diff = "hard";
            }
        }

        return diff;
    }

    private parseProblem(problem: any[], diff: string): Problems {

        let result: Problems = {
            "problemID": problem[0] + " " + problem[2],
            "name": problem[1] + " - " + problem[2],
            "plateform": "Live Archive",
            "link": `https://icpcarchive.ecs.baylor.edu/index.php?option=onlinejudge&page=show_problem&problem=${problem[0]}`,
            "difficulty": diff
        };

        return result;
    }

    /**
     * Get all problems from Live Archive website using uhunt api
     * @returns {Promise<InsightResponse>}
     */
    async getListOfProblems(): Promise<InsightResponse> {
        const path: string = "https://icpcarchive.ecs.baylor.edu/uhunt/api/p";
        let res: any[] = [];
        let ans: any[] = [];

        try {

            let problem: any = await this.readAPI(path);

            for (let i: number = 0; i < problem.length; i += 1) {

                let diff: string;

                let accepted: number = problem[i][18];
                let wrong: number = problem[i][16];
                let total: number = (accepted + wrong);

                diff = this.getDifficulty(accepted, total);

                let result: Problems = this.parseProblem(problem[i], diff);

                console.log(result);

                res.push(result);
            }
        }
        catch(err) {
            return Promise.reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Can't get problems from Live Archive"
                    }
            });
        }

        try {
            await this.problemsModel.create(res);

            ans = await this.problemsModel
                    .find({})
                    .exec();
        }
        catch (err) {
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "Can't get problems from Live Archive"
                }
            });
        }
        
        console.log("RESULTTTTT: ", ans.length);

        return {
            code: HTTPStatusCodes.CREATED,
            body : {
                result: ans
            }
        };
    }

    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING LA READ API");

        let res: any;

        const options = {
            uri: link,
            json: true
        };

        await request(options)
            .then((body) => {
                console.log("BEFOOORE: ", body.length);
                res = body;
            })
            .catch((err) => {
                throw new Error(err);
            });
        return res;
    }
    
    /**
     * Return Live Archive problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    async getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        try {
            problems = await this.problemsModel.find({
                                "plateform": this.getPlateform(),
                                "difficulty": level
                            }).exec();
        }
        catch(err) {
            return  Promise.reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Live Archive"
                        }
                    });
        }

        console.log("RESULTTTTT: ", problems.length);

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: problems
            }
        };
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): string {
        
        return "Live Archive";
    
    }
}

/*
 *  If the user didn't specify any palteform in the query
 *  use all plateforms at the same time to search for a problem
 *  matching the query
*/

@Service()
export class AllPlateforms extends Plateform {

    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                private codeforces: Codeforces,
                private livearchive: LiveArchive,
                private uva: Uva) {
        super(problemsModel);
        Log.trace("AllPlateforms::init()");
    }
    
    /**
     * Return all problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    async getProblems(key: string): Promise<InsightResponse> {
        let codeforcesProblems: InsightResponse;
        let uvaProblems: InsightResponse;
        let livearchiveProblems: InsightResponse;
        let res: any[] = [];

        try {
            codeforcesProblems = await this.codeforces.getProblems(key);
            livearchiveProblems = await this.livearchive.getProblems(key);
            uvaProblems = await this.uva.getProblems(key);

            res.push(codeforcesProblems.body.result);
            res.push(livearchiveProblems.body.result);
            res.push(uvaProblems.body.result);

        }
        catch(err) {
            console.log("ERRRRRORRR: ", err);
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "Can't get problems"
                }
            });
        }

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: res
            }
        };
    }
    
    /**
     * Get all problems from Codeforces, Uva and Live Archive websites using uhunt api
     * @returns {Promise<InsightResponse>}
     */
    async getListOfProblems(): Promise<InsightResponse> {
        
        let codeforcesProblems: InsightResponse;
        let uvaProblems: InsightResponse;
        let livearchiveProblems: InsightResponse;
        let res: any[];

        try {
            codeforcesProblems = await this.codeforces.getListOfProblems();
            livearchiveProblems = await this.livearchive.getListOfProblems();
            uvaProblems = await this.uva.getListOfProblems();

            res = uvaProblems.body.result;

        }
        catch(err) {
            console.log("ERRRRRORRR: ", err);
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "Can't get problems"
                }
            });
        }

        return {
            code: HTTPStatusCodes.CREATED,
            body : {
                result: res
            }
        };
    }

    readAPI(link: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Return all problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    async getProblemsFiltered(level: string): Promise<InsightResponse> {
        let codeforcesProblems: InsightResponse;
        let uvaProblems: InsightResponse;
        let livearchiveProblems: InsightResponse;
        let res: any[] = [];

        try {
            codeforcesProblems = await this.codeforces.getProblemsFiltered(level);
            livearchiveProblems = await this.livearchive.getProblemsFiltered(level);
            uvaProblems = await this.uva.getProblemsFiltered(level);

            res.push(codeforcesProblems.body.result);
            res.push(livearchiveProblems.body.result);
            res.push(uvaProblems.body.result);

        }
        catch(err) {
            console.log("ERRRRRORRR: ", err);
            return Promise.reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: "Can't get problems"
                }
            });
        }

        return {
            code: HTTPStatusCodes.OK,
            body : {
                result: res
            }
        };
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
    
    getPlateform(): string {
        
        return null;
    
    }
}