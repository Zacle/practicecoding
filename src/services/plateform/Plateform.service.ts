import { Inject , Service } from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import { PlateformFactory } from "../../interfaces/InterfaceFacade";
import { InsightResponse } from "../../interfaces/InterfaceFacade";
import Log from "../../Util";
import { Problems } from "../../models/Problems";
import { Contests } from "../../models/contests/Contests";
import { Submissions } from "../../models/contests/Submissions";
import { Users } from "../../models/Users";
import axios from "axios";
import { HTTPStatusCodes } from "../../util/httpCode";



/*
 *  Define the plateform superclass that will serve as a base
 *  class for all plateform
*/
@Service()
export abstract class Plateform implements PlateformFactory {    

    constructor(@Inject(Problems) private problems: MongooseModel<Problems>,
                @Inject(Contests) private contests: MongooseModel<Contests>,
                @Inject(Users) private users: MongooseModel<Users>) {
        Log.trace("Plateform::init() Updated");
    }

    abstract getPlateform(): string;

    /**
     * Return all problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    abstract getProblems(key: string): Promise<InsightResponse>;

    /**
     * Get all problems from all platforms website using their api
     * @returns {Promise<InsightResponse>}
     */
    abstract getListOfProblems(): Promise<InsightResponse>;

    /**
     * Return all problems of the given difficulty
     * @param level 
     * @param page
     * @returns {Promise<InsightResponse>}
     */
    abstract getProblemsFiltered(level: string, page: number): Promise<InsightResponse>;

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problem
     */
    abstract addSpecificProblem(contestID: string, problem: any): Promise<InsightResponse>;

    /**
     * @description update the contest standing
     * @param contest
     * @param user 
     * @param problem
     */
    abstract updateContest(contest: Contests, user: Users, problem?: Problems): Promise<InsightResponse>;

    /**
     * @description add problems from a codeforces contest
     * @param contestID 
     * @param codeforceID 
     */
    addProblemsFromCodeforces(contestID: string, codeforceID: number): Promise<InsightResponse> {
        return Promise.reject({
            code: HTTPStatusCodes.BAD_REQUEST,
            body: {
                name: "Bad Request"
            }
        });
    }
    
    /**
     * @description add problems from past uva contest
     * @param contestID 
     * @param problems 
     */
    addProblemsFromUVA(contestID: string, problems: number[]): Promise<InsightResponse> {
        return Promise.reject({
            code: HTTPStatusCodes.BAD_REQUEST,
            body: {
                name: "Bad Request"
            }
        });
    }

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     */
    abstract addRandomProblems(contestID: string, quantity: number): Promise<InsightResponse>;

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     * @param plateform
     */
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
                                                            { $match: { 
                                                                "plateform": plateform,
                                                                "difficulty": "easy"
                                                            } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (MEDIUM > 0) {
                    problems = await this.problems.aggregate([
                                                            { $sample : { size: MEDIUM } },
                                                            { $match: { 
                                                                "plateform": plateform,
                                                                "difficulty": "medium"
                                                            } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (HARD > 0) {
                    problems = await this.problems.aggregate([
                                                            { $sample : { size: HARD } },
                                                            { $match: { 
                                                                "plateform": plateform,
                                                                "difficulty": "hard"
                                                            } }
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
                console.log("ERRORR: ", err);
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
     * Return submission object based on platform
     * @param submission 
     */
    public getSubmission(submission: any | any[]): any {
       return null;
    }

    /**
     * @param link The link of the API to get all problems.
     */
    abstract async readAPI(link: string): Promise<any>;
    
}

@Service()
export class Codeforces extends Plateform {
     
    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                @Inject(Contests) private contestsModel: MongooseModel<Contests>,
                @Inject(Users) private usersModel: MongooseModel<Users>) {
        super(problemsModel, contestsModel, usersModel);
        Log.trace("Codeforces::init() Updated");
    }

    /**
     * Return all Codeforces problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    getProblems(key: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let problems: any[] = [];

            try {
                problems = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "name": {
                                        "$regex": key,
                                        "$options": "i"
                                    }
                                }).limit(10).exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: problems
                    }
                });
            }
            catch(err) {
                return  reject({
                            code: HTTPStatusCodes.BAD_REQUEST,
                            body: {
                                name: "Can't get problems from Codeforces"
                            }
                        });
            }
        });
    }

    /**
     * Get all problems from Codeforces website using their api
     * @returns {Promise<InsightResponse>}
     */
    async getListOfProblems(): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const path: string = "https://codeforces.com/api/problemset.problems";
            let res: any[] = [];

            this.problemsModel.find({}).remove().exec();

            try {
                let status: any = await this.readAPI(path);

                if (status.status == "FAILED") {
                    return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Codeforces"
                        }
                    });
                }

                let promise: any = status.result;

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

                await this.problemsModel.create(res);
                            
                console.log("RESULTTTTT: ", res.length);

                return resolve({
                    code: HTTPStatusCodes.CREATED,
                    body : {
                        result: res
                    }
                });
            }
            catch(err) {
                return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Codeforces"
                        }
                });
            }
            
        });
    }

    /**
     * @param link The link of the API to get all problems.
     */
    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING Codeforces READ API WITH AXIOS");

        return new Promise(async (resolve, reject) => {
            let res: any = {};

            await axios.get(link)
                .then((result) => {
                    res = result.data;
                    return resolve(res);
                })
                .catch((err) => {
                    console.log("ERROR MESSAGE: ", err.response.data);
                    if (err.response.data.status == "FAILED") {
                        return resolve(err.response.data);
                    }
                    else {
                        return reject(err);
                    }
                });
            
        });
    }
    
    /**
     * Return Codeforces problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level: string, page: number): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let total: number;
            let problems: any[] = [];
            const size = 10;

            try {
                total = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "difficulty": level
                                }).count().exec();

                problems = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "difficulty": level
                                })
                                .limit(size)
                                .skip(size * (page - 1))
                                .exec();

                
                console.log("RESULTTTTT: ", problems.length);

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: {
                            problems: problems,
                            total: total,
                            per_page: size
                        }
                    }
                });
            }
            catch(err) {
                return  reject({
                            code: HTTPStatusCodes.BAD_REQUEST,
                            body: {
                                name: "Can't get problems from Codeforces"
                            }
                        });
            }
        });
    }

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problem
     */
    addSpecificProblem(contestID: string, problem: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problems: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                problems = await this.problemsModel.findOne({problemID: problem.problemID, plateform: this.getPlateform()}).exec();

                if (!problems) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }

                let saveContest = new this.contestsModel(contest);
                saveContest.problems.push(problems._id);
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
                if (codeforces.length == 0) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Sorry!. This contest is not yet added on Practice Coding OJ"
                        }
                    });
                }
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
                response = await this.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        });
    } 

    /**
     * @description update the contest standing
     * @param contest
     * @param user 
     * @param problem
     */
    updateContest(contest: Contests, user: Users): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const handle: string = user.codeforces;
            const link: string = "https://codeforces.com/api/user.status?handle=" + handle;
            let result: any;
            let status: any[];
            let statusFiltered: any[];
            let startSecond: number = contest.startDate.getTime() / 1000;

            try {
                result = await this.readAPI(link);
                if (result.status == "FAILED") {
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: []
                        }
                    });
                }
                status = result.result;
                statusFiltered = status.filter((submission) => {
                    return submission.creationTimeSeconds >= startSecond && submission.verdict != "TESTING";
                });
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: statusFiltered
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Return submission object based on platform
     * @param submission 
     */
    public getSubmission(submission: any | any[]): Promise<Submissions> {
        return new Promise<Submissions>((resolve) => {
            let sub: Submissions = {
                submissionID: submission.id,
                verdict: this.getVerdict(submission.verdict),
                language: submission.programmingLanguage,
                submissionTime: new Date(submission.creationTimeSeconds * 1000),
                problemName: submission.problem.index + ". " + submission.problem.name,
                OJ: this.getPlateform(),
                problemID: submission.problem.contestId + "" + submission.problem.index,
                problemLink: "",
                user: null,
                team: null
            };
            resolve(sub);
        });
    }

    private getVerdict(verdict: string): string {
        if (verdict == "OK")
            return "ACCEPTED";
        return verdict;
    }
    
    getPlateform(): string {
        return "Codeforces";
    }
}

@Service()
export class Uva extends Plateform {
    
    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                @Inject(Contests) private contestsModel: MongooseModel<Contests>,
                @Inject(Users) private usersModel: MongooseModel<Users>) {
        super(problemsModel, contestsModel, usersModel);
        Log.trace("Uva::init()");
    }
    
    /**
     * Return all Uva problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    getProblems(key: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let problems: any[] = [];

            try {
                problems = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "name": {
                                        "$regex": key,
                                        "$options": "i"
                                    }
                                }).limit(10).exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: problems
                    }
                });
            }
            catch(err) {
                return  reject({
                            code: HTTPStatusCodes.BAD_REQUEST,
                            body: {
                                name: "Can't get problems from Uva"
                            }
                        });
            }
        });
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
        return new Promise<InsightResponse>(async (resolve, reject) => {
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
                await this.problemsModel.create(res);

                return resolve({
                    code: HTTPStatusCodes.CREATED,
                    body : {
                        result: res
                    }
                });
            }
            catch(err) {
                return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Can't get problems from Uva"
                        }
                });
            }
            
            
        });
    }

    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING UVA READ API");

        return new Promise(async (resolve, reject) => {
            let res: any;

            await axios.get(link)
                .then((result) => {
                    console.log("BEFOOORE: ", result.data);
                    res = result.data;
                    return resolve(res);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }
    
    /**
     * Return Uva problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level: string, page: number): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let total: number;
            let problems: any[] = [];
            const size = 10;

            try {
                total = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "difficulty": level
                                }).count().exec();

                problems = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "difficulty": level
                                })
                                .limit(size)
                                .skip(size * (page - 1))
                                .exec();

                
                console.log("RESULTTTTT: ", problems.length);

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: {
                            problems: problems,
                            total: total,
                            per_page: size
                        }
                    }
                });
            }
            catch(err) {
                return  reject({
                            code: HTTPStatusCodes.BAD_REQUEST,
                            body: {
                                name: "Can't get problems from Uva"
                            }
                        });
            }
        });
    }

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problem 
     * @param userID 
     */
    addSpecificProblem(contestID: string, problem: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problems: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                problems = await this.problemsModel.findOne({problemID: problem.problemID, plateform: this.getPlateform()}).exec();

                if (!problems) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }

                let saveContest = new this.contestsModel(contest);
                saveContest.problems.push(problems._id);
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
                for (let i = 0; i < problems.length; i++) {
                    await this.saveUvaProblems(saveContest, problems[i]);
                }

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
                        name: "Couldn't add problems from Uva contest to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description asynchronous function used to save problems within a loop
     * @param contest 
     * @param id 
     */
    private saveUvaProblems(contest: any, id: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let problem: Problems;

            try {
                problem = await this.problemsModel.findOne({contestID: id, plateform: this.getPlateform()}).exec();
                contest.problems.push(problem._id);
                await contest.save();
                return resolve(contest);
            }
            catch (err) {
                return reject(err);
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
                response = await this.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        });
    }

    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest: Contests, user: Users, problem: Problems): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const handle: string = user.uva;
            let converToId: string = "https://uhunt.onlinejudge.org/api/uname2uid/" + handle;
            const link: string = "https://uhunt.onlinejudge.org/api/subs-pids/";
            let status: any;
            let statusFiltered: any[];
            let startSecond: number = contest.startDate.getTime() / 1000;

            try {
                let converted: number = await this.readAPI(converToId);
                if (converted == 0) {
                    return resolve({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            result: []
                        }
                    });
                }
                status = await this.readAPI(link + converted + "/" + problem.problemID);
                const convertedToString: string = "" + converted;
                if (!status) {
                    return resolve({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            result: []
                        }
                    });
                }
                statusFiltered = status[convertedToString].subs.filter((submission: any[]) => {
                    console.log("SUBMISSION: ", submission);
                    return submission[4] >= startSecond && this.getVerdict(submission[2]) != "IN_QUEUE";
                });
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: statusFiltered
                    }
                });
            }
            catch (err) {
                return resolve({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        result: []
                    }
                });
            }
        });
    } 

    /**
     * Return submission object based on platform
     * @param submission 
     */
    public getSubmission(submission: any | any[]): Promise<Submissions> {
        return new Promise<Submissions>(async (resolve, reject) => {
            let problem: Problems;
            try {
                problem = await this.problemsModel.findOne({problemID: submission[1], plateform: this.getPlateform()}).exec();
                let sub: Submissions = {
                    submissionID: submission[0],
                    problemID: submission[1],
                    verdict: this.getVerdict(submission[2]),
                    submissionTime: new Date(submission[4] * 1000),
                    OJ: this.getPlateform(),
                    problemName: problem.name,
                    problemLink: problem.link,
                    language: this.getLanguage(submission[5]),
                    user: null,
                    team: null
                };
                return resolve(sub);
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    /**
     * @description convert to a readable language
     * @param language 
     */
    private getLanguage(language: number): string {
        switch(language) {
            case 1:
                return "AINSI C";
            case 2:
                return "Java";
            case 3:
                return "C++";
            case 4:
                return "Pascal";
            case 5:
                return "C++11";
        }
    }

    /**
     * @description return the verdict
     * @param verdict 
     */
    private getVerdict(verdict: number): string {
        switch(verdict) {
            case 10:
                return "FAILED";
            case 15:
                return "FAILED";
            case 20:
                return "IN_QUEUE";
            case 30:
                return "COMPILATION_ERROR";
            case 35:
                return "RESTRICTED_FUNCTION";
            case 40:
                return "RUNTIME_ERROR";
            case 45:
                return "OUTPUT_ERROR";
            case 50:
                return "TIME_LIMIT_EXCEEDED";
            case 60:
                return "MEMORY_LIMIT_EXCEEDED";
            case 70:
                return "WRONG_ANSWER";
            case 80:
                return "PRESENTATION_ERROR";
            case 90:
                return "ACCEPTED";
            default:
                return "FAILED";
        }
    }
    
    getPlateform(): string {
        
        return "Uva";
    
    }
}

@Service()
export class LiveArchive extends Plateform {

    constructor(@Inject(Problems) private problemsModel: MongooseModel<Problems>,
                @Inject(Contests) private contestsModel: MongooseModel<Contests>,
                @Inject(Users) private usersModel: MongooseModel<Users>) {
        super(problemsModel, contestsModel, usersModel);
        Log.trace("LiveArchive::init()");
    }

    /**
     * Return all Live Archive problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    getProblems(key: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let problems: any[] = [];

            try {
                problems = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "name": {
                                        "$regex": key,
                                        "$options": "i"
                                    }
                                }).limit(10).exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: problems
                    }
                });
            }
            catch(err) {
                return  reject({
                            code: HTTPStatusCodes.BAD_REQUEST,
                            body: {
                                name: "Can't get problems from Live Archive"
                            }
                        });
            }
        });
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
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const path: string = "https://icpcarchive.ecs.baylor.edu/uhunt/api/p";
            let res: Problems[] = [];

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

                await this.problemsModel.create(res);

                console.log("RESULTTTTT: ", res.length);

                return resolve({
                    code: HTTPStatusCodes.CREATED,
                    body : {
                        result: res
                    }
                });
            }
            catch(err) {
                return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: err
                        }
                });
            }
        });
    }

    async readAPI(link: string): Promise<any> {
        
        console.info("CALLLLING LA READ API");

        return new Promise(async (resolve, reject) => {
            let res: any;

            await axios.get(link)
                .then((result) => {
                    console.log("BEFOOORE: ", result.data);
                    res = result.data;
                    return resolve(res);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }
    
    /**
     * Return Live Archive problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level: string, page: number): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let total: number;
            let problems: any[] = [];
            const size = 10;

            try {
                total = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "difficulty": level
                                }).count().exec();

                problems = await this.problemsModel.find({
                                    "plateform": this.getPlateform(),
                                    "difficulty": level
                                })
                                .limit(size)
                                .skip(size * (page - 1))
                                .exec();

                
                console.log("RESULTTTTT: ", problems.length);

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: {
                            problems: problems,
                            total: total,
                            per_page: size
                        }
                    }
                });
            }
            catch(err) {
                return  reject({
                            code: HTTPStatusCodes.BAD_REQUEST,
                            body: {
                                name: "Can't get problems from Live Archive"
                            }
                        });
            }
        });
    }

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problem 
     */
    addSpecificProblem(contestID: string, problem: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let problems: Problems;

            try {
                contest = await this.contestsModel.findById(contestID).exec();
                problems = await this.problemsModel.findOne({problemID: problem.problemID, plateform: this.getPlateform()}).exec();

                if (!problem) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }

                let saveContest = new this.contestsModel(contest);
                saveContest.problems.push(problems._id);
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
                response = await this.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        });
    }

    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest: Contests, user: Users, problem: Problems): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            const handle: string = user.livearchive;
            let converToId: string = "https://icpcarchive.ecs.baylor.edu/uhunt/api/uname2uid/" + handle;
            const link: string = "https://icpcarchive.ecs.baylor.edu/uhunt/api/subs-pids/";
            let status: any;
            let statusFiltered: any[];
            let startSecond: number = contest.startDate.getTime() / 1000;

            try {
                let converted: number = await this.readAPI(converToId);
                if (converted == 0) {
                    return resolve({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            result: []
                        }
                    });
                }
                status = await this.readAPI(link + converted + "/" + problem.problemID);
                const convertedToString: string = "" + converted;
                if (!status) {
                    return resolve({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            result: []
                        }
                    });
                }
                statusFiltered = status[convertedToString].subs.filter((submission: any[]) => {
                    return submission[4] >= startSecond && this.getVerdict(submission[2]) != "IN_QUEUE";
                });
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: statusFiltered
                    }
                });
            }
            catch (err) {
                return resolve({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        result: []
                    }
                });
            }
        });
    } 

    /**
     * Return submission object based on platform
     * @param submission 
     */
    public getSubmission(submission: any | any[]): Promise<Submissions> {
        return new Promise<Submissions>(async (resolve, reject) => {
            let problem: Problems;
            try {
                problem = await this.problemsModel.findOne({problemID: submission[1], plateform: this.getPlateform()}).exec();
                let sub: Submissions = {
                    submissionID: submission[0],
                    problemID: submission[1],
                    verdict: this.getVerdict(submission[2]),
                    submissionTime: new Date(submission[4] * 1000),
                    OJ: this.getPlateform(),
                    problemName: problem.name,
                    problemLink: problem.link,
                    language: this.getLanguage(submission[5]),
                    user: null,
                    team: null
                };
                return resolve(sub);
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    /**
     * @description convert to a readable language
     * @param language 
     */
    private getLanguage(language: number): string {
        switch(language) {
            case 1:
                return "AINSI C";
            case 2:
                return "Java";
            case 3:
                return "C++";
            case 4:
                return "Pascal";
            case 5:
                return "C++11";
        }
    }

    /**
     * @description return the verdict
     * @param verdict 
     */
    private getVerdict(verdict: number): string {
        switch(verdict) {
            case 10:
                return "FAILED";
            case 15:
                return "FAILED";
            case 20:
                return "IN_QUEUE";
            case 30:
                return "COMPILATION_ERROR";
            case 35:
                return "RESTRICTED_FUNCTION";
            case 40:
                return "RUNTIME_ERROR";
            case 45:
                return "OUTPUT_ERROR";
            case 50:
                return "TIME_LIMIT_EXCEEDED";
            case 60:
                return "MEMORY_LIMIT_EXCEEDED";
            case 70:
                return "WRONG_ANSWER";
            case 80:
                return "PRESENTATION_ERROR";
            case 90:
                return "ACCEPTED";
            default:
                return "FAILED";
        }
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
                @Inject(Users) private usersModel: MongooseModel<Users>,
                private codeforces: Codeforces,
                private livearchive: LiveArchive,
                private uva: Uva) {
        super(problemsModel, contestsModel, usersModel);
        Log.trace("AllPlateforms::init()");
    }
    
    /**
     * Return all problems matching the given key
     * @param key 
     * @return {Promise<InsightResponse>}
     */
    getProblems(key: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let codeforcesProblems: InsightResponse;
            let uvaProblems: InsightResponse;
            let livearchiveProblems: InsightResponse;
            let res: any[] = [];

            try {
                codeforcesProblems = await this.codeforces.getProblems(key);
                livearchiveProblems = await this.livearchive.getProblems(key);
                uvaProblems = await this.uva.getProblems(key);

                res = res.concat(codeforcesProblems.body.result);
                res = res.concat(livearchiveProblems.body.result);
                res = res.concat(uvaProblems.body.result);
                console.log("ADDED UVA RESULTTTTT: ", res.length);
                res = this.shuflle(res);

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: res
                    }
                });
            }
            catch(err) {
                console.log("ERRRRRORRR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Can't get problems"
                    }
                });
            }
        });
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
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let codeforcesProblems: InsightResponse;
            let uvaProblems: InsightResponse;
            let livearchiveProblems: InsightResponse;
            let res: any[];

            try {
                codeforcesProblems = await this.codeforces.getListOfProblems();
                uvaProblems = await this.uva.getListOfProblems();
                livearchiveProblems = await this.livearchive.getListOfProblems();
                
                return resolve(livearchiveProblems);

            }
            catch(err) {
                console.log("ERRRRRORRR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Can't get problems"
                    }
                });
            }
        });
    }

    readAPI(link: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Return all problems of the given difficulty
     * @param level 
     * @returns {Promise<InsightResponse>}
     */
    async getProblemsFiltered(level: string, page: number): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let codeforcesProblems: InsightResponse;
            let uvaProblems: InsightResponse;
            let livearchiveProblems: InsightResponse;
            let res: any[] = [];
            const size = 30;
            let total = 0;

            try {
                codeforcesProblems = await this.codeforces.getProblemsFiltered(level, page);
                uvaProblems = await this.uva.getProblemsFiltered(level, page);
                livearchiveProblems = await this.livearchive.getProblemsFiltered(level, page);
                

                res = res.concat(codeforcesProblems.body.result.problems);
                res = res.concat(livearchiveProblems.body.result.problems);
                res = res.concat(uvaProblems.body.result.problems);
                res = this.shuflle(res);

                total = codeforcesProblems.body.result.total + uvaProblems.body.result.total + livearchiveProblems.body.result.total;

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body : {
                        result: {
                            problems: res,
                            total: total,
                            per_page: size
                        }
                    }
                });
            }
            catch(err) {
                console.log("ERRRRRORRR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Can't get problems"
                    }
                });
            }
        });
    }

    getAllProblems(): Promise<InsightResponse> {
       return new Promise<InsightResponse>(async (resolve, reject) => {
           let problems: Problems[];

           try {
                problems = await this.problemsModel.find({}).exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: problems
                    }
                });
           }
           catch (err) {
            return reject({
                code: HTTPStatusCodes.BAD_REQUEST,
                body: {
                    name: `Couldn't  get all problems`
                }
            });
           }
       });
    }

    addSpecificProblem(contestID: string, problem: Problems): Promise<InsightResponse> {
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
                                                            { $sample : { size: EASY } },
                                                            { $match: {
                                                                "difficulty": "easy"
                                                             } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (MEDIUM > 0) {
                    problems = await this.problemsModel.aggregate([
                                                            { $sample : { size: MEDIUM } },
                                                            { $match: {
                                                                "difficulty": "medium"
                                                             } }
                                                        ]
                                                        ).exec();

                    problems.forEach((pr: Problems) => {
                        saveContest.problems.push(pr._id);
                    });
                    
                }
                if (HARD > 0) {
                    problems = await this.problemsModel.aggregate([
                                                            { $sample : { size: HARD } },
                                                            { $match: {
                                                                "difficulty": "hard"
                                                             } }
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

    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest: Contests, user: Users): Promise<InsightResponse> {
        throw new Error("Method not implemented.");
    } 
    
    getPlateform(): string {
        return null;
    }
}