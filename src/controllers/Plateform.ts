import * as fs from "fs";
import { parse } from "papaparse";
import { IProblem, PlateformFactory, UserStatistic, Body } from "./InterfaceFacade";
import { InsightResponse, InsightResponseSuccessBody, InsightResponseErrorBody } from "./InterfaceFacade";
import { Level, PlateformName } from "./Level";
import Log from "../Util";
import { Saver, Problem } from "./Problem";

/*
 *  Define the plateform superclass that will serve as a base
 *  class for all plateform
 *  Fields:
 *      - plateformFactory: name of the plateform to search for the query
 *      - listOfProblems: list of problems matching the current query
 *      - userStat: statistic of the user on a particular plateform
*/

export abstract class Plateform implements PlateformFactory {    
    protected plateformFactory: PlateformFactory;
    protected listOfProblems: IProblem[] = [];
    protected userStat: UserStatistic;
    protected plateformName: PlateformName;

    constructor() {
        Log.trace("Plateform::init()");
    }

    abstract getPlateform(): Promise<InsightResponse>;

    abstract getUserStatistic(): Promise<InsightResponse>;

    abstract getProblems(key: string): Promise<InsightResponse>;

    abstract getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse>;

    abstract getProblemsFiltered(level: Level): Promise<InsightResponse>;

    /**
     * Wraps writeFile in a promise.
     * @param content The Base64 content of the file to read.
     * @returns A buffer containing the contents of the file.
     */
    protected async writeFileAsync(path: string): Promise<void> {

        let file = fs.readFileSync(path, "utf-8");
        await parse(file, {
            header: true,
            complete: (results) => {
                let problem: IProblem;
                results.data.forEach(result => {
                    problem = new Problem(result.id, result.name, result.plateform, result.Difficulty);
                    this.listOfProblems.push(problem);
                });
            }
        });
    }

    protected async saveList(): Promise<any[]> {

        let res: any[] = [];
        for (let i = 0; i < this.listOfProblems.length; i++) {
            let problem: IProblem = await this.listOfProblems[i];
            res.push({
                "id": problem.getID,
                "name": problem.getName,
                "plateform": problem.getPlateformName,
                "link": problem.getProblemURI
            });
        }

        return res;
    }
    
}

export class Codeforces extends Plateform {    
    constructor() {
        super();
        Log.trace("Codeforces::init()");
        this.listOfProblems = [];
        this.plateformName = PlateformName.CODEFORCES;
    }

    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: undefined});
    }

    async getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        this.plateformName = plateform;
        this.listOfProblems = [];
        const path: string = "codeforces" + ".csv";
        let promise = this.writeFileAsync(path);
        
        if (this.listOfProblems.length == 0) {
            const code: number = 400;
            let ans: InsightResponseErrorBody;
            ans.error = "Couldn't not parse zip files";
            let response: InsightResponse;
            response.code = code;
            response.body = ans;
            return Promise.reject(response);
        }
        let res: any[];
        res = await this.saveList();

        return Promise.resolve({
            code: 204,
            body: {
                "result": res
            }
        });
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: undefined});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

export class Spoj extends Plateform {

    constructor() {
        super();
        Log.trace("Spoj::init()");
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

export class Uva extends Plateform {

    constructor() {
        super();
        Log.trace("Uva::init()");
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    async getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        this.plateformName = plateform;
        this.listOfProblems = [];
        const path: string = "uva" + ".csv";
        let promise = this.writeFileAsync(path);
        
        if (this.listOfProblems.length == 0) {
            const code: number = 400;
            let ans: InsightResponseErrorBody;
            ans.error = "Couldn't not parse zip files";
            let response: InsightResponse;
            response.code = code;
            response.body = ans;
            return Promise.reject(response);
        }
        let res: any[];
        res = await this.saveList();

        return Promise.resolve({
            code: 204,
            body: {
                "result": res
            }
        });
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

export class LiveArchive extends Plateform {

    constructor() {
        super();
        Log.trace("LiveArchive::init()");
    }

    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    async getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        this.plateformName = plateform;
        this.listOfProblems = [];
        const path: string = "livearchive" + ".csv";
        let promise = this.writeFileAsync(path);
        
        if (this.listOfProblems.length == 0) {
            const code: number = 400;
            let ans: InsightResponseErrorBody;
            ans.error = "Couldn't not parse zip files";
            let response: InsightResponse;
            response.code = code;
            response.body = ans;
            return Promise.reject(response);
        }
        let res: any[];
        res = await this.saveList();

        return Promise.resolve({
            code: 204,
            body: {
                "result": res
            }
        });
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

/*
 *  If the user didn't specify any palteform in the query
 *  use all plateforms at the same time to search for a problem
 *  matching the query
*/

export class AllPlateforms extends Plateform {

    constructor() {
        super();
        Log.trace("AllPlateforms::init()");
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}