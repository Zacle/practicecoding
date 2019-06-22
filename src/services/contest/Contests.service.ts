import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Contests } from "../../models/contests/Contests";
import { Standings } from "../../models/contests/Standings";
import { Submissions } from "../../models/contests/Submissions";
import { Users } from "../../models/Users";
import { InsightResponse, IContest, AccessType } from "../../interfaces/InterfaceFacade";
import PlateformBuilding from "../plateformBuilder/PlateformBuilding.service";
import { Plateform } from "../plateform/Plateform.service";


@Service()
export abstract class ContestsService {

    constructor(@Inject(Contests) protected contests: MongooseModel<Contests>,
                @Inject(Submissions) protected submissions: MongooseModel<Submissions>,
                @Inject(Standings) protected standings: MongooseModel<Standings>,
                @Inject(Users) protected users: MongooseModel<Users>,
                protected plateformBuilder: PlateformBuilding) {}

    /**
     * Create a new Contest
     * @param contest
     */
    protected abstract async create(contest: IContest): Promise<InsightResponse>;

    /**
     * @description computes the duration of the contest
     * @param date1 
     * @param date2 
     */
    protected duration(date1: Date, date2: Date): string {
        // Get 1 day in milliseconds
        const one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        let difference_ms = date2_ms - date1_ms;
        // take out milliseconds
        difference_ms = difference_ms/1000;

        let seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60; 
        let minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms/60; 
        const hours = Math.floor(difference_ms % 24);  
        const days = Math.floor(difference_ms/24);

        let duration: string = "";
        if (days > 0) {
            if (days == 1)
                duration += days + " day, ";
            else
                duration += days + " days, ";
        }
        if (hours > 0) {
            if (hours == 1) 
                duration += hours + " hour and ";
            else
                duration += hours + " hours and ";
        }
        if (minutes < 2)
            duration += minutes + " minute";
        else
            duration += minutes + "minutes";

        return duration;

    }

    /**
     * @returns all coming public contests 
     */
    async getAllComingContests(): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Contests[];

            try {
                contests = await this.contests.find({
                                        startDate : {
                                            "$gt": new Date()
                                        },
                                        access: AccessType.PUBLIC
                                    })
                                    .populate("owner")
                                    .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contests
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all public contest"
                    }
                });
            }
        });
    }

    /**
     * @returns all running public contests 
     */
    async getAllRunningContests(): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Contests[];

            try {
                contests = await this.contests.find({
                                        startDate : {
                                            "$lte": new Date()
                                        },
                                        endDate: {
                                            "$gte": new Date()
                                        },
                                        access: AccessType.PUBLIC
                                    })
                                    .populate("owner")
                                    .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contests
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all public contests that are running"
                    }
                });
            }
        });
    }

    /**
     * @returns past public contests 
     */
    async getPastContests(page: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Contests[];
            const size = 10;

            try {
                contests = await this.contests.find({
                                        endDate: {
                                            "$lt": new Date()
                                        },
                                        access: AccessType.PUBLIC
                                    })
                                    .limit(size)
                                    .skip(size * (page - 1))
                                    .populate("owner")
                                    .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contests
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all past public contests"
                    }
                });
            }
        });
    }

    /**
     * @param userID
     * @returns all contests attended by the user 
     */
    async getContests(userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Users;

            try {
                contests = await this.users.findById(userID)
                                           .populate("contests")
                                           .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contests.contests
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all contests attended by the user"
                    }
                });
            }
        });
    }

    /**
     * @param contestID 
     * @returns a specific contest
     */
    async getContest(contestID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate("owner")
                                             .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the contest"
                    }
                });
            }
        });
    }

    /**
     * Update contest
     * @param name 
     * @param startDateYear 
     * @param startDateMonth 
     * @param startDateDay 
     * @param endDateYear 
     * @param endDateMonth 
     * @param endDateDay 
     * @param startTimeHour 
     * @param startTimeMinute 
     * @param endTimeHour 
     * @param endTimeMinute 
     * @param access 
     * @param contestID 
     */
    async updateContest(name: string, startDateYear: number, startDateMonth: number, startDateDay: number, 
                        endDateYear: number, endDateMonth: number, endDateDay: number, startTimeHour: number,
                        startTimeMinute: number, endTimeHour: number, endTimeMinute: number, access: string, contestID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let startDate = new Date(startDateYear, startDateMonth - 1, startDateDay, startTimeHour, startTimeMinute);
            let endDate = new Date(endDateYear, endDateMonth - 1, endDateDay, endTimeHour, endTimeMinute);
            let duration: string = this.duration(startDate, endDate);

            try {
                const admin: boolean = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to update this contest"
                        }
                    });
                }
                contest = await this.contests.findById(contestID).exec();
                contest.startDate = startDate;
                contest.endDate = endDate;
                contest.duration = duration;

                const saveContest = new this.contests(contest);
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
                        name: "Couldn't update the contest"
                    }
                });
            }
        });
    }

    /**
     * Verify if the user is the contest owner
     * @param contestID 
     * @param userID 
     */
    private async isAdmin(contestID: string, userID: string): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {
            let contest: Contests;
            try {
                contest = await this.contests.findById(contestID, "-__v").exec();
                if (contest) {
                    if (contest.owner.toString() == userID.toString())
                        return resolve(true);
                    return resolve(false);
                }
                return resolve(false);
            }
            catch(err) {
                return reject(err);
            }
        });
    }

    /**
     * @description delete a contest
     * @param contestID 
     * @param userID 
     */
    async deleteContest(contestID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let contest: Contests;

            try {
                const admin: boolean = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to delete this contest"
                        }
                    });
                }
                contest = await this.contests.findByIdAndRemove(contestID).exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't delete the contest"
                    }
                });
            }
        });
    }

    /**
     * @description return all submissions of this contest
     * @param contestID 
     * @param page
     */
    protected abstract async getSubmissions(contestID: string, page: number): Promise<InsightResponse>;

    /**
     * @description get all problems of this contest
     * @param contestID 
     */
    async getProblems(contestID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate("problems")
                                             .exec();

                if (!contest) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Contest ID Not Found"
                        }
                    });
                }

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest.problems
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all problems of this contest"
                    }
                });
            }
        });
    }

    /**
     * @description get all registrants of this contest
     * @param contestID 
     * @param page
     */
    protected abstract async getRegistrants(contestID: string, page: number): Promise<InsightResponse>;

    /**
     * @description get standing of the contest
     * @param contestID 
     * @param page
     */
    protected abstract async getStanding(contestID: string, page: number):Promise<InsightResponse>;

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problemID 
     * @param userID 
     */
    async addSpecificProblem(contestID: string, problem: any, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let plateform: Plateform;
            let result: InsightResponse;

            try {
                let admin = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to add problems"
                        }
                    });
                }
                plateform = this.plateformBuilder.createPlateform(problem.plateform);

                result = await plateform.addSpecificProblem(contestID, problem._id);

                return resolve(result);
            }
            catch (err) {
                result = err;
                return reject(result);
            }
        });
    }

    /**
     * @description add problems from a codeforces contest
     * @param contestID 
     * @param codeforceID 
     * @param userID 
     */
    async addProblemsFromCodeforces(contestID: string, codeforceID: number, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: InsightResponse;
            let plateform: Plateform;

            try {
                let admin = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to add problems"
                        }
                    });
                }
                plateform = this.plateformBuilder.createPlateform("Codeforces");
                result = await plateform.addProblemsFromCodeforces(contestID, codeforceID);
                return resolve(result);
            }
            catch (err) {
                result = err;
                return reject(result);
            }
        });
    }

    /**
     * @description add problems from past uva contest
     * @param contestID 
     * @param problems 
     * @param userID 
     */
    async addProblemsFromUVA(contestID: string, problems: number[], userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: InsightResponse;
            let plateform: Plateform;

            try {
                let admin = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to add problems"
                        }
                    });
                }
                plateform = this.plateformBuilder.createPlateform("Uva");
                result = await plateform.addProblemsFromUVA(contestID, problems);
                return resolve(result);
            }
            catch (err) {
                result = err;
                return reject(result);
            }
        });
    }

    /**
     * @description add problems from an existing public contest
     * @param contestID 
     * @param existingID 
     * @param userID 
     */
    async addProblemsFromExisting(contestID: string, existingID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let existing: Contests;

            try {
                let admin = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to add problems"
                        }
                    });
                }
                contest = await this.contests.findById(contestID).exec();
                let saveContest = new this.contests(contest);
                existing = await this.contests.findById(existingID).exec();

                saveContest.problems.push(...existing.problems);
                await saveContest.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add problems from an existing contest to this contest"
                    }
                });
            }
        });
    }

    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID 
     * @param quantity 
     * @param userID 
     * @param plateformName
     */
    async addRandomProblems(contestID: string, quantity: number, userID: string, plateformName: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let result: InsightResponse;
            let plateform: Plateform;

            try {
                let admin = await this.isAdmin(contestID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to add problems"
                        }
                    });
                }
                plateform = this.plateformBuilder.createPlateform(plateformName);
                result = await plateform.addRandomProblems(contestID, quantity);
                return resolve(result);
            }
            catch(err) {
                result = err;
                return reject(result);
            }
        });
    }

    /**
     * @description remove a problem to the contest
     * @param contestID 
     * @param problemID 
     * @param userID 
     */
    async removeProblem(contestID: string, problemID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;

            try {
                contest = await this.contests.findByIdAndUpdate(
                    contestID,
                    {$pull: { problems: { _id: problemID } } }
                ).exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't remove this problem"
                    }
                });
            }
        });
    }

    /**
     * @description register a user or a team to the contest
     * @param contestID 
     * @param userID
     */
    protected abstract async register(contestID: string, userID: string): Promise<InsightResponse>;

    /**
     * @description unregister a user or a team from the contest
     * @param contestID 
     * @param userID
     */
    protected abstract async unregister(contestID: string, userID: string): Promise<InsightResponse>;

    /**
     * @description add a submission from user
     * @param contestID 
     * @param submission 
     * @param userID
     */
    protected abstract async addSubmission(contestID: string, submission: any, userID: string): Promise<InsightResponse>;

    /**
     * @description update the contest standing
     * @param contestID 
     */
    protected abstract async updateStanding(contestID: string): Promise<InsightResponse>;
}