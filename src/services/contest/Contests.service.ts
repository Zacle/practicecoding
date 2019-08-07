import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Contests } from "../../models/contests/Contests";
import { Standings } from "../../models/contests/Standings";
import { Submissions } from "../../models/contests/Submissions";
import { Trackers } from "../../models/contests/Trackers";
import { Users } from "../../models/Users";
import { Problems } from "../../models/Problems";
import { InsightResponse, IContest, AccessType, ContestType } from "../../interfaces/InterfaceFacade";
import PlateformBuilding from "../plateformBuilder/PlateformBuilding.service";
import { Plateform } from "../plateform/Plateform.service";
import { Groups } from "../../models/Groups";

@Service()
export abstract class ContestsService {

    constructor(@Inject(Contests) protected contests: MongooseModel<Contests>,
                @Inject(Submissions) protected submissions: MongooseModel<Submissions>,
                @Inject(Standings) protected standings: MongooseModel<Standings>,
                @Inject(Users) protected users: MongooseModel<Users>,
                @Inject(Trackers) protected trackers: MongooseModel<Trackers>,
                @Inject(Groups) protected groups: MongooseModel<Groups>,
                protected plateformBuilder: PlateformBuilding) {}

    /**
     * Create a new Contest
     * @param contest
     * @param id
     */
    public abstract async create(contest: IContest, id?: string): Promise<InsightResponse>;

    /**
     * Create a new group contest
     * @param contest
     * @param id
     * @param groupID
     */
    public abstract async createGroupContest(contest: IContest, groupID: string, id?: string): Promise<InsightResponse>;

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
                duration += days + " day";
            else
                duration += days + " days";
        }
        if (hours > 0) {
            if (days > 0)
                duration += ", ";
            if (hours == 1) 
                duration += hours + " hour";
            else
                duration +=  hours + " hours";
        }
        if (minutes > 0) {
            if (days > 0 || hours > 0)
                duration += " and ";
            if (minutes < 2)
                duration += minutes + " minute";
            else
                duration += minutes + " minutes";
        }

        return duration;

    }

    /**
     * @description Checks the validity of the dates
     * @param startDate 
     * @param endDate 
     */
    protected isValidDate(startDate: Date, endDate: Date): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (startDate.getTime() > endDate.getTime()) {
                return resolve(false);
            }
            if (startDate.getTime() < Date.now()) {
                return resolve(false);
            }
            return resolve(true);
        });
    }

    /**
     * @description determines if the contest standing should be updated
     * @param startDate 
     * @param endDate 
     */
    protected shouldUpdate(startDate: Date, endDate: Date): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (startDate.getTime() > Date.now()) {
                return resolve(false);
            }
            if (endDate.getTime() < Date.now()) {
                return resolve(false);
            }
            return resolve(true);
        });
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
     * @param username
     * @returns all coming contests registered by the user 
     */
    async getComingContests(username: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Users;
            let comingContests: any[] = [];

            try {
                contests = await this.users.findOne({username: username})
                                           .populate("contests")
                                           .exec();

                let date = new Date();
                for (let i = 0; i < contests.contests.length; i++) {
                    let contest: any = contests.contests[i];
                    if (contest.startDate > date) {
                        comingContests.push(contest);
                    }
                }
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: comingContests
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
     * @param username
     * @returns all running contests registered by the user 
     */
    async getRunningContests(username: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Users;
            let runningContests: any[] = [];

            try {
                contests = await this.users.findOne({username: username})
                                           .populate("contests")
                                           .exec();

                let date = new Date();
                for (let i = 0; i < contests.contests.length; i++) {
                    let contest: any = contests.contests[i];
                    if (contest.startDate < date && contest.endDate > date) {
                        runningContests.push(contest);
                    }
                }
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: runningContests
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
     * @param username
     * @returns all past contests attended by the user 
     */
    async getContests(username: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Users;
            let pastContests: any[] = [];

            try {
                contests = await this.users.findOne({username: username})
                                           .populate("contests")
                                           .exec();

                let date = new Date();
                for (let i = 0; i < contests.contests.length; i++) {
                    let contest: any = contests.contests[i];
                    if (contest.endDate < date) {
                        pastContests.push(contest);
                    }
                }
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: pastContests
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

                if (!contest) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Contest ID not found"
                        }
                    });
                }

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
     * @param Icontest 
     * @param contestID 
     * @param access
     */
    async updateContest(Icontest: IContest, contestID: string, access: boolean): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let startDate = new Date(Icontest.startDateYear, Icontest.startDateMonth - 1, Icontest.startDateDay, Icontest.startTimeHour, Icontest.startTimeMinute);
            let endDate = new Date(Icontest.endDateYear, Icontest.endDateMonth - 1, Icontest.endDateDay, Icontest.endTimeHour, Icontest.endTimeMinute);

            try {
                const admin: boolean = await this.isAdmin(contestID, Icontest.owner);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to update this contest"
                        }
                    });
                }
                contest = await this.contests.findById(contestID).exec();
                let isValid: boolean = await this.isValidStartDate(startDate);
                if (isValid) {
                    contest.startDate = startDate;
                }
                else {
                    startDate = contest.startDate;
                }
                isValid = await this.isValidEndDate(startDate, endDate);
                if (isValid) {
                    contest.endDate = endDate;
                }
                else {
                    endDate = contest.endDate;
                } 
                contest.duration = this.duration(startDate, endDate);
                if (access) {
                    contest.access = Icontest.access;
                }

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
     * @description verify if the start date can be updated
     * @param date 
     */
    private isValidStartDate(date: Date): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (date.getTime() < Date.now()) {
                return resolve(false);
            }
            return resolve(true);
        });
    }

    /**
     * @description verify if the end date can be updated
     * @param startDate 
     * @param endDate 
     */
    private isValidEndDate(startDate: Date, endDate: Date): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (endDate.getTime() < startDate.getTime()) {
                return resolve(false);
            }
            return resolve(true);
        });
    }

    /**
     * Verify if the user is the contest owner
     * @param contestID 
     * @param userID 
     */
    protected async isAdmin(contestID: string, userID: string): Promise<boolean> {
        
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
     * @description return the type of the contest (INDIVIDUAL OR TEAM)
     * @param contestID 
     */
    getContestType(contestID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            try {
                contest = await this.contests.findById(contestID).exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest.type
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the contest type"
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
    abstract async getSubmissions(contestID: string, page: number): Promise<InsightResponse>;

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
    abstract async getRegistrants(contestID: string, page: number): Promise<InsightResponse>;

    /**
     * @description get standing of the contest
     * @param contestID 
     * @param page
     */
    abstract async getStanding(contestID: string, page: number):Promise<InsightResponse>;

    /**
     * @description add a specific problem to the contest
     * @param contestID 
     * @param problemID 
     * @param userID 
     */
    async addSpecificProblem(contestID: string, problem: Problems, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let plateform: Plateform;
            let result: InsightResponse;
            let contest: Contests;

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
                let contestOver: boolean = await this.isContestOver(contest);
                if (contestOver) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Contest is over"
                        }
                    });
                }
                let exists: boolean = await this.problemExists(contest, problem);
                if (exists) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "Problem already exist"
                        }
                    });
                }
                plateform = this.plateformBuilder.createPlateform(problem.plateform);

                result = await plateform.addSpecificProblem(contestID, problem);

                return resolve(result);
            }
            catch (err) {
                result = err;
                return reject(result);
            }
        });
    }

    /**
     * verify if this problem already exists before adding it
     * @param contest 
     * @param problem 
     */
    private problemExists(contest: Contests, problem: Problems): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            
            for (let i = 0; i < contest.problems.length; i++) {
                if (contest.problems[i] == problem._id)
                    return resolve(true);
            }
            return resolve(false);
        });
    }

    /**
     * verify if the contest is over prior to modify problems
     * @param date 
     */
    private isContestOver(contest: Contests): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            
            try {
                if (contest.endDate.getTime() < Date.now()) {
                    resolve(true);
                }
                resolve(false);
            }
            catch (err) {
                resolve(true);
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
            let contest: Contests;

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
                let contestOver: boolean = await this.isContestOver(contest);
                if (contestOver) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Contest is over"
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
            let contest: Contests;

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
                let contestOver: boolean = await this.isContestOver(contest);
                if (contestOver) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Contest is over"
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
                let contestOver: boolean = await this.isContestOver(contest);
                if (contestOver) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Contest is over"
                        }
                    });
                }
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
            let contest: Contests;

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
                let contestOver: boolean = await this.isContestOver(contest);
                if (contestOver) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Contest is over"
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
     * @description remove a problem from the contest
     * @param contestID 
     * @param problemID 
     * @param userID 
     */
    async removeProblem(contestID: string, problemID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;

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
                let contestOver: boolean = await this.isContestOver(contest);
                if (contestOver) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Contest is over"
                        }
                    });
                }
                let saveContest = new this.contests(contest);
                saveContest.problems = saveContest.problems.filter((id: string) => id != problemID);
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
    abstract async register(contestID: string, userID: string): Promise<InsightResponse>;

    /**
     * @description unregister a user or a team from the contest
     * @param contestID 
     * @param userID
     */
    abstract async unregister(contestID: string, userID: string): Promise<InsightResponse>;

    /**
     * @description add a submission from user
     * @param contestID 
     * @param submissionID
     */
    protected async addSubmission(contestID: string, submissionID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;

            try {
                contest = await this.contests.findById(contestID).exec();
                let saveContest = new this.contests(contest);
                saveContest.submissions.push(submissionID);
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
                        name: "Couldn't add this sumbmission to the contest"
                    }
                });
            }
        });
    }

    /**
     * @description update the contest standing
     * @param contestID 
     */
    abstract async updateStanding(contestID: string): Promise<InsightResponse>;
}