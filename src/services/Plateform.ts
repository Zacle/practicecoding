import * as fs from "fs";
import { parse } from "papaparse";
import { IProblem, PlateformFactory, UserStatistic, Body } from "./InterfaceFacade";
import { InsightResponse, InsightResponseSuccessBody, InsightResponseErrorBody } from "./InterfaceFacade";
import { Level, PlateformName } from "./Level";
import Log from "../Util";
import { Saver, Problem } from "./Problem";
import { resolve } from "bluebird";

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

    abstract getListOfProblems(): Promise<InsightResponse>;

    abstract getProblemsFiltered(level: string): Promise<InsightResponse>;

    public getList(): IProblem[] {
        return this.listOfProblems;
    }

    /**
     * Wraps writeFile in a promise.
     * @param path The path of the file to read.
     */
    protected async writeFileAsync(path: string): Promise<void> {

        let file =  new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                const reader = fs.readFileSync(path, "utf-8");
                resolve(reader);
            }, 100);    
        });
        return file.then(async (data) => {
            return await new Promise<void>((resolve, reject) => {
                parse(data, {
                    header: true,
                    complete: (results) => {
                        let problem: IProblem;
                        results.data.forEach(result => {
                            problem = new Problem(result.id, result.name, result.plateform, result.link, result.Difficulty);
                            this.listOfProblems.push(problem);
                        });
                    }
                });
                resolve();
            });
        });
    }

    protected async saveList(): Promise<any[]> {

        let res: any[] = [];
        for (let i = 0; i < this.listOfProblems.length; i++) {
            let problem: IProblem = this.listOfProblems[i];
            res.push({
                "id": problem.getID(),
                "name": problem.getName(),
                "plateform": problem.getPlateformName(),
                "link": problem.getProblemURI()
            });
        }

        return res;
    }

    protected checker(key: string, plateform: string): Promise<any[]> {

        let res: any[] = [];

        return new Promise<any[]>((resolve, reject) => {
            try {
                for (let i = 0; i < this.listOfProblems.length; i++) {
                    let problem: IProblem = this.listOfProblems[i];
                    if (problem.getName()) {
                        if (problem.getName().toLowerCase().includes(key)) {
                            res.push({
                                "id": problem.getID(),
                                "name": problem.getName(),
                                "plateform": plateform,
                                "link": problem.getProblemURI()
                            });
                        }  
                    }
                }
            }
            catch(err) {
                reject(err);
            }
            resolve(res);
        });
    }
    
}

export class Codeforces extends Plateform {    
    constructor() {
        super();
        Log.trace("Codeforces::init()");
        this.listOfProblems = [];
        this.plateformName = PlateformName.CODEFORCES;
    }


    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        if (key == "") {
            return new Promise<InsightResponse>((resolve, reject) => {
                resolve({
                    code: 200,
                    body: {
                        result: []
                    }
                });
            });
        }
        
        try {
            problems = await this.checker(key, "Codeforces");
        }
        catch(err) {
            console.log("ERRRORRR LA: ", err);
            return new Promise<InsightResponse>((resolve, reject) => {
                reject({
                    code: 400,
                    body: {
                        error: "Can't find all problems that contain the given key"
                    }
                });
            });
        }

        return Promise.resolve({
            code: 200,
            body: {
                result: problems
            }
        });
    }

    async getListOfProblems(): Promise<InsightResponse> {
        this.plateformName = PlateformName.CODEFORCES;
        this.listOfProblems = [];
        const path: string = "codeforces" + ".csv";
        let promise = await this.writeFileAsync(path);
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
    
    getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        if (level != "EASY" && level != "MEDIUM" && level != "HARD")
            return Promise.reject({code: 400, body: {
                "error": "wrong level"
        }});
        
        return new Promise<InsightResponse>((resolve, reject) => {
            this.listOfProblems.forEach((problem: IProblem) => {
                if (problem.getProblemStatistic() == level) {
                    problems.push({
                        "id": problem.getID(),
                        "name": problem.getName(),
                        "plateform": "Codeforces",
                        "link": problem.getProblemURI()
                    });
                }
            });
            resolve({
                code: 200,
                body: {
                    result: problems
                }
            });
        });
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        if (this.plateformName != PlateformName.CODEFORCES)
            return Promise.reject({code: -1, body: {
                "error": "Plateform name doesn't match"
            }});
        return Promise.resolve({
            code: 204,
            body: {
                name: "codeforces"
            }
        });
    }
}


export class Uva extends Plateform {

    constructor() {
        super();
        Log.trace("Uva::init()");
    }
    
    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        if (key == "") {
            return new Promise<InsightResponse>((resolve, reject) => {
                resolve({
                    code: 200,
                    body: {
                        result: []
                    }
                });
            });
        }
        
        try {
            problems = await this.checker(key, "Uva");
        }
        catch(err) {
            console.log("ERRRORRR UVA: ", err);
            return new Promise<InsightResponse>((resolve, reject) => {
                reject({
                    code: 400,
                    body: {
                        error: "Can't find all problems that contain the given key"
                    }
                });
            });
        }

        return Promise.resolve({
            code: 200,
            body: {
                result: problems
            }
        });
    }
    
    async getListOfProblems(): Promise<InsightResponse> {
        this.plateformName = PlateformName.UVA;
        this.listOfProblems = [];
        const path: string = "uva" + ".csv";
        let promise = await this.writeFileAsync(path);

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
    
    getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        if (level != "EASY" && level != "MEDIUM" && level != "HARD")
            return Promise.reject({code: 400, body: {
                "error": "wrong level"
        }});

        return new Promise<InsightResponse>((resolve, reject) => {
            this.listOfProblems.forEach((problem: IProblem) => {
                if (problem.getProblemStatistic() == level) {
                    problems.push({
                        "id": problem.getID(),
                        "name": problem.getName(),
                        "plateform": "Uva",
                        "link": problem.getProblemURI()
                    });
                }
            });
            resolve({
                code: 200,
                body: {
                    result: problems
                }
            });
        });
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        if (this.plateformName != PlateformName.UVA)
            return Promise.reject({code: -1, body: {
                "error": "Plateform name doesn't match"
            }});
        return Promise.resolve({
            code: 204,
            body: {
                name: "uva"
            }
        });
    }
}

export class LiveArchive extends Plateform {

    constructor() {
        super();
        Log.trace("LiveArchive::init()");
    }

    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        if (key == "") {
            return new Promise<InsightResponse>((resolve, reject) => {
                resolve({
                    code: 200,
                    body: {
                        result: []
                    }
                });
            });
        }
        
        try {
            problems = await this.checker(key, "Live Archive");
        }
        catch(err) {
            console.log("ERRRORRR LA: ", err);
            return new Promise<InsightResponse>((resolve, reject) => {
                reject({
                    code: 400,
                    body: {
                        error: "Can't find all problems that contain the given key"
                    }
                });
            });
        }

        return Promise.resolve({
            code: 200,
            body: {
                result: problems
            }
        });
    }
    
    async getListOfProblems(): Promise<InsightResponse> {
        this.plateformName = PlateformName.LIVEARCHIVE;
        this.listOfProblems = [];
        const path: string = "livearchive" + ".csv";
        let promise = await this.writeFileAsync(path);

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
    
    getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        if (level != "EASY" && level != "MEDIUM" && level != "HARD")
            return Promise.reject({code: 400, body: {
                "error": "wrong level"
        }});
        
        return new Promise<InsightResponse>((resolve, reject) => {
            this.listOfProblems.forEach((problem: IProblem) => {
                if (problem.getProblemStatistic() == level) {
                    problems.push({
                        "id": problem.getID(),
                        "name": problem.getName(),
                        "plateform": "Live Archive",
                        "link": problem.getProblemURI()
                    });
                }
            });
            resolve({
                code: 200,
                body: {
                    result: problems
                }
            });
        });
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        if (this.plateformName != PlateformName.LIVEARCHIVE)
            return Promise.reject({code: -1, body: {
                "error": "Plateform name doesn't match"
            }});
        return Promise.resolve({
            code: 204,
            body: {
                name: "livearchive"
            }
        });
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
    
    async getProblems(key: string): Promise<InsightResponse> {
        let problems: any[] = [];

        let codeforces: Plateform = new Codeforces();
        let livearchive: Plateform = new LiveArchive();
        let uva: Plateform = new Uva();

        let codeforcesProblems: InsightResponse = await codeforces.getListOfProblems();
        let livearchiveProblems: InsightResponse = await livearchive.getListOfProblems();
        let uvaProblems: InsightResponse = await uva.getListOfProblems();

        let cList: InsightResponse = await codeforces.getProblems(key);
        let lList: InsightResponse = await livearchive.getProblems(key);
        let uList: InsightResponse = await uva.getProblems(key);
        
        return new Promise<InsightResponse>((resolve, reject) => {
            cList.body.result.forEach((problem: IProblem) => {
                problems.push(problem);
            });
            lList.body.result.forEach((problem: IProblem) => {
                problems.push(problem);
            });
            uList.body.result.forEach((problem: IProblem) => {
                problems.push(problem);
            });
            resolve({
                code: 200,
                body: {
                    result: problems
                }
            });
        });
    }
    
    getListOfProblems(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    async getProblemsFiltered(level: string): Promise<InsightResponse> {

        let problems: any[] = [];

        if (level != "EASY" && level != "MEDIUM" && level != "HARD")
            return Promise.reject({code: 400, body: {
                "error": "wrong level"
        }});

        let codeforces: Plateform = new Codeforces();
        let livearchive: Plateform = new LiveArchive();
        let uva: Plateform = new Uva();

        let codeforcesProblems: InsightResponse = await codeforces.getListOfProblems();
        let livearchiveProblems: InsightResponse = await livearchive.getListOfProblems();
        let uvaProblems: InsightResponse = await uva.getListOfProblems();

        let cList: InsightResponse = await codeforces.getProblemsFiltered(level);
        let lList: InsightResponse = await livearchive.getProblemsFiltered(level);
        let uList: InsightResponse = await uva.getProblemsFiltered(level);
        
        return new Promise<InsightResponse>((resolve, reject) => {
            cList.body.result.forEach((problem: IProblem) => {
                problems.push(problem);
            });
            lList.body.result.forEach((problem: IProblem) => {
                problems.push(problem);
            });
            uList.body.result.forEach((problem: IProblem) => {
                problems.push(problem);
            });
            resolve({
                code: 200,
                body: {
                    result: problems
                }
            });
        });
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}