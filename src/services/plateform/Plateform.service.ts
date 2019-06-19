import { Inject , Service } from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import { PlateformFactory } from "../../interfaces/InterfaceFacade";
import { InsightResponse } from "../../interfaces/InterfaceFacade";
import Log from "../../Util";
import { Problems } from "../../models/Problems";
import { Contests } from "../../models/contests/Contests";
import request = require("request-promise");
import axios from "axios";
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

    constructor(@Inject(Problems) private problems: MongooseModel<Problems>,
                @Inject(Contests) private contests: MongooseModel<Contests>) {
        Log.trace("Plateform::init()");
    }

    abstract getPlateform(): string;

    abstract getUserStatistic(): Promise<InsightResponse>;

    abstract getProblems(key: string): Promise<InsightResponse>;

    abstract getListOfProblems(): Promise<InsightResponse>;

    abstract getProblemsFiltered(level: string): Promise<InsightResponse>;

    abstract addSpecificProblem(contestID: string, problemID: string): Promise<InsightResponse>;

    addProblemsFromCodeforces(contestID: string, codeforceID: number): Promise<InsightResponse> {
        return Promise.reject({
            code: HTTPStatusCodes.BAD_REQUEST,
            body: {
                name: "Bad Request"
            }
        });
    }
    
    addProblemsFromUVA(contestID: string, problems: number[]): Promise<InsightResponse> {
        return Promise.reject({
            code: HTTPStatusCodes.BAD_REQUEST,
            body: {
                name: "Bad Request"
            }
        });
    }

    abstract addRandomProblems(contestID: string, quantity: number): Promise<InsightResponse>;

    async randomProblems(contestID: string, quantity: number, plateform: string): Promise<InsightResponse> {

        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problems: Problems[];
            const EASY = Math.ceil(quantity * (40 / 100));
            const MEDIUM = Math.floor(quantity * (40 / 100));
            const HARD = Math.ceil(quantity * (20 / 100));

            try {
                contest = await this.contests.findById(contestID).exec();
                let saveContest = new this.contests(contest);
                if (EASY > 0) {
                    problems = await this.problems.aggregate([
                                                            { $sample : { size: EASY } },
                                                            { $match: { "plateform": plateform } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (MEDIUM > 0) {
                    problems = await this.problems.aggregate([
                                                            { $sample : { size: MEDIUM } },
                                                            { $match: { "plateform": plateform } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (HARD > 0) {
                    problems = await this.problems.aggregate([
                                                            { $sample : { size: HARD } },
                                                            { $match: { "plateform": plateform } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: `Couldn't add random problems from ${plateform} to this contest`
                    }
                });
            }
        });
    }

    /**
     * Wraps writeFile in a promise.
     * @param link The link of the API to get all problems.
     */
    abstract async readAPI(link: string): Promise<any>;
    
}

@Service()
export class Codeforces extends Plateform {   
    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                @Inject(Contests) private contestsModel: MongooseModel<Contests>) {
        super(problemsModel, contestsModel);
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
                            }).limit(10).exec();
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
                    "contestID": problem.contestId,
                    "name": problem.index + ". " + problem.name,
                    "plateform": this.getPlateform(),
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
     * @param link The link of the API to get all problems.
     */
    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING Codeforces READ API");

        return new Promise(async (resolve, reject) => {
            let res: any = {};

            await axios.get(link)
                .then((result) => {
                    if (result.data.status === "FAILED") {
                        return reject(result.data.comment);
                    }
                    console.log("BEFOOORE: ", result.data.result.problems.length);
                    res = result.data.result;
                })
                .catch((err) => {
                    return reject(err);
                });
            return resolve(res);
        });
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

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problemID 
     */
    addSpecificProblem(contestID: string, problemID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problem: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                problem = await this.problemsModel.findOne({problemID: problemID, plateform: this.getPlateform()}).exec();

                if (!problem) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }

                let saveContest = new this.contestsModel(contest);
                let new_problem = new this.problemsModel(problem);
                saveContest.problems.push(new_problem._id);
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add problem to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description add problems from a codeforces contest
     * @param contestID 
     * @param codeforceID 
     */
    addProblemsFromCodeforces(contestID: string, codeforceID: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let codeforces: Problems[];

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                codeforces = await this.problemsModel.find({contestID: codeforceID, plateform: this.getPlateform()}).exec();
                let saveContest = new this.contestsModel(contest);
                codeforces.forEach((problem: Problems) => {
                    saveContest.problems.push(problem._id);
                });
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add problems from Codeforces contest to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     */
    addRandomProblems(contestID: string, quantity: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let response: InsightResponse;
            try {
                response = await super.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        });
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

    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                @Inject(Contests) private contestsModel: MongooseModel<Contests>) {
        super(problemsModel, contestsModel);
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
                            }).limit(10).exec();
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
            "problemID": problem[0],
            "contestID": problem[1],
            "name": problem[1] + " - " + problem[2],
            "plateform": this.getPlateform(),
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

        return new Promise(async (resolve, reject) => {
            let res: any;

            await axios.get(link)
                .then(response => {
                    return JSON.parse(response.data);
                })
                .then((body) => {
                    console.log("BEFOOORE: ", body.length);
                    res = body;
                })
                .catch((err) => {
                    return reject(err);
                });
            return resolve(res);
        });
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

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problemID 
     * @param userID 
     */
    addSpecificProblem(contestID: string, problemID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problem: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                problem = await this.problemsModel.findOne({problemID: problemID, plateform: this.getPlateform()}).exec();

                if (!problem) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }

                let saveContest = new this.contestsModel(contest);
                let new_problem = new this.problemsModel(problem);
                saveContest.problems.push(new_problem._id);
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add problem to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description add problems from past uva contest
     * @param contestID 
     * @param problems 
     */
    async addProblemsFromUVA(contestID: string, problems: number[]): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problem: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                let saveContest = new this.contestsModel(contest);
                let new_contest: Contests = await new Promise<Contests>(async (resolve, reject) => {
                    await problems.forEach(async (pr: number) => {
                        problem = await this.problemsModel.findOne({contestID: pr, plateform: this.getPlateform()}).exec();
                        saveContest.problems.push(problem._id);
                    });
                    await saveContest.save();
                    return resolve(saveContest);
                });

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: new_contest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add problems from Uva contest to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     */
    addRandomProblems(contestID: string, quantity: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let response: InsightResponse;
            try {
                response = await super.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        });
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

    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                @Inject(Contests) private contestsModel: MongooseModel<Contests>) {
        super(problemsModel, contestsModel);
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
                            }).limit(10).exec();
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
            "problemID": problem[0],
            "contestID": problem[1],
            "name": problem[1] + " - " + problem[2],
            "plateform": this.getPlateform(),
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

        return new Promise(async (resolve, reject) => {
            let res: any;

            await axios.get(link)
                .then(response => {
                    return JSON.parse(response.data);
                })
                .then((body) => {
                    console.log("BEFOOORE: ", body.length);
                    res = body;
                })
                .catch((err) => {
                    return reject(err);
                });
            return resolve(res);
        });
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

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problemID 
     */
    addSpecificProblem(contestID: string, problemID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problem: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                problem = await this.problemsModel.findOne({problemID: problemID, plateform: this.getPlateform()}).exec();

                if (!problem) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }

                let saveContest = new this.contestsModel(contest);
                let new_problem = new this.problemsModel(problem);
                saveContest.problems.push(new_problem._id);
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add problem to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     */
    addRandomProblems(contestID: string, quantity: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let response: InsightResponse;
            try {
                response = await super.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        });
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
                @Inject(Contests) private contestsModel: MongooseModel<Contests>,
                private codeforces: Codeforces,
                private livearchive: LiveArchive,
                private uva: Uva) {
        super(problemsModel, contestsModel);
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
            res = this.shuflle(res);
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
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    private shuflle(a: any[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
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

    addSpecificProblem(contestID: string, problemID: string): Promise<InsightResponse> {
        throw new Error("Method not implemented.");
    }

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     */
    addRandomProblems(contestID: string, quantity: number): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problems: Problems[];
            const EASY = Math.ceil(quantity * (40 / 100));
            const MEDIUM = Math.floor(quantity * (40 / 100));
            const HARD = Math.ceil(quantity * (20 / 100));

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                let saveContest = new this.contestsModel(contest);
                if (EASY > 0) {
                    problems = await this.problemsModel.aggregate([
                                                            { $sample : { size: EASY } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (MEDIUM > 0) {
                    problems = await this.problemsModel.aggregate([
                                                            { $sample : { size: MEDIUM } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (HARD > 0) {
                    problems = await this.problemsModel.aggregate([
                                                            { $sample : { size: HARD } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: `Couldn't add random problems to this contest`
                    }
                });
            }
        });
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
    
    getPlateform(): string {
        return null;
    }
}