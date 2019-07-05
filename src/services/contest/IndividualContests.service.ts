import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Contests } from "../../models/contests/Contests";
import { Standings } from "../../models/contests/Standings";
import { Submissions } from "../../models/contests/Submissions";
import { Trackers } from "../../models/contests/Trackers";
import { Problems } from "../../models/Problems";
import { Groups } from "../../models/Groups";
import { InsightResponse, AccessType, IContest, ContestType } from "../../interfaces/InterfaceFacade";
import { ContestsService } from "./Contests.service";
import { Users } from "../../models/Users";
import PlateformBuilding from "../../services/plateformBuilder/PlateformBuilding.service";
import { Plateform } from "../../services/plateform/Plateform.service";

@Service()
export class IndividualContestService extends ContestsService {

    constructor(@Inject(Contests) protected contests: MongooseModel<Contests>,
                @Inject(Submissions) protected submissions: MongooseModel<Submissions>,
                @Inject(Standings) protected standings: MongooseModel<Standings>,
                @Inject(Users) protected users: MongooseModel<Users>,
                @Inject(Trackers) protected trackers: MongooseModel<Trackers>,
                @Inject(Groups) protected groups: MongooseModel<Groups>,
                protected plateformBuilder: PlateformBuilding) {

                super(contests, submissions, standings, users,trackers, groups, plateformBuilder);
    }

    /**
     * Create a new Contest
     * @param contest
     * @param userID
     */
    public create(contest: IContest, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let startDate = new Date(contest.startDateYear, contest.startDateMonth - 1, contest.startDateDay, contest.startTimeHour, contest.startTimeMinute);
            let endDate = new Date(contest.endDateYear, contest.endDateMonth - 1, contest.endDateDay, contest.endTimeHour, contest.endTimeMinute);
            let duration: string = this.duration(startDate, endDate);

            let new_contest: Contests = {
                name: contest.name,
                startDate: startDate,
                endDate: endDate,
                duration: duration,
                owner: contest.owner,
                access: contest.access,
                type: ContestType.INDIVIDUAL,
                problems: [],
                users: [],
                teams: [],
                submissions: [],
                standings: null
            };
            

            try {
                let isValid: boolean = await this.isValidDate(startDate, endDate);
                if (!isValid) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Start date and End date are not valid"
                        }
                    });
                }
                let user: Users = await this.users.findById(userID).exec();
                let createdContest = new this.contests(new_contest);
                createdContest.users.push(user._id);
                await createdContest.save();
                let tracker: Trackers;

                tracker = {
                    country: user.country,
                    solvedCount: 0,
                    penalty: 0,
                    problemsSolved: [],
                    problemsUnsolved: [],
                    contestant: user._id,
                    contestants: null,
                    contestID: createdContest._id
                };

                let createTracker = new this.trackers(tracker);
                await createTracker.save();

                let standing: Standings = {
                    trackers: [createTracker],
                    contestID: createdContest._id
                };

                let createStanding = new this.standings(standing);
                await createStanding.save();

                createdContest.standings = createStanding._id;
                await createdContest.save();

                let saveUser = new this.users(user);
                saveUser.contests.push(createdContest._id);
                await saveUser.save();

                return resolve({
                    code: HTTPStatusCodes.CREATED,
                    body: {
                        result: createdContest
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
     * Create a new group contest
     * @param contest
     * @param groupID
     * @param userID
     */
    public createGroupContest(contest: IContest, groupID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let startDate = new Date(contest.startDateYear, contest.startDateMonth - 1, contest.startDateDay, contest.startTimeHour, contest.startTimeMinute);
            let endDate = new Date(contest.endDateYear, contest.endDateMonth - 1, contest.endDateDay, contest.endTimeHour, contest.endTimeMinute);
            let duration: string = this.duration(startDate, endDate);

            let new_contest: Contests = {
                name: contest.name,
                startDate: startDate,
                endDate: endDate,
                duration: duration,
                owner: contest.owner,
                access: contest.access,
                type: ContestType.INDIVIDUAL,
                problems: [],
                users: [],
                teams: [],
                submissions: [],
                standings: null
            };
            let group: Groups;

            try {
                let isValid: boolean = await this.isValidDate(startDate, endDate);
                if (!isValid) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "Start date and End date are not valid"
                        }
                    });
                }
                let user: Users = await this.users.findById(userID).exec();
                group = await this.groups.findById(groupID).exec();

                let createdContest = new this.contests(new_contest);
                createdContest.users.push(user._id);
                await createdContest.save();

                let standing: Standings = {
                    trackers: [],
                    contestID: createdContest._id
                };

                let createStanding = new this.standings(standing);
                await createStanding.save();

                createdContest.standings = createStanding._id;
                await createdContest.save();

                let saveGroup = new this.groups(group);
                saveGroup.contests.push(createdContest._id);
                await saveGroup.save();

                let saveUser = new this.users(user);
                saveUser.contests.push(createdContest._id);
                await saveUser.save();

                return resolve({
                    code: HTTPStatusCodes.CREATED,
                    body: {
                        result: createdContest
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
     * @description return all submissions of this contest
     * @param contestID 
     * @param page
     */
    getSubmissions(contestID: string, page: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            const size = 15;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate({
                                                 path: "submissions",
                                                 populate: {
                                                     path: "user"
                                                 }
                                             })
                                             .limit(size)
                                             .skip(size * (page - 1))
                                             .exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest.submissions
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the submissions of the contest"
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
    getRegistrants(contestID: string, page: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            const size = 15;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate("users")
                                             .limit(size)
                                             .skip(size * (page - 1))
                                             .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest.users
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the registrants of the contest"
                    }
                });
            }
        });
    }

    /**
     * @description get standing of the contest
     * @param contestID 
     * @param page
     */
    getStanding(contestID: string, page: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let standing: Standings;
            let contest: Contests;
            const size = 15;

            try {
                contest = await this.contests.findById(contestID).exec();
                standing = await this.standings.findById(contest.standings)
                                               .populate({
                                                   path: "trackers",
                                                   populate: [{
                                                       path: "problemsSolved"
                                                   },
                                                   {
                                                       path: "problemsUnsolved"
                                                   },
                                                   {
                                                       path: "contestant"
                                                   }]
                                               })
                                               .limit(size)
                                               .skip(size * (page - 1))
                                               .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: standing
                    }
                });


            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the standing of the contest"
                    }
                });
            }
        });
    }

    /**
     * @description register a user to the contest
     * @param contestID 
     * @param userID
     */
    register(contestID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let user: Users;
            let tracker: Trackers;
            let standing: Standings;

            try {
                contest = await this.contestExists(contestID);
                if (!contest) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "CONTEST ID Not Found"
                        }
                    });
                }
                if (contest.type != ContestType.INDIVIDUAL) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "This is not an individual contest"
                        }
                    });
                }

                user = await this.userExists(userID);

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "USER ID Not Found"
                        }
                    });
                }
                
                if (contest.endDate.getTime() < Date.now()) {
                    return reject({
                        code: HTTPStatusCodes.FORBIDDEN,
                        body: {
                            name: "This contest is over"
                        }
                    });
                }
                let isRegistered: boolean = await this.isUserAlreadyRegistered(user, contestID);
                if (isRegistered) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "User already registered to the contest"
                        }
                    });
                }

                standing = await this.standings.findOne({contestID: contest._id}).exec();

                tracker = {
                    country: user.country,
                    solvedCount: 0,
                    penalty: 0,
                    problemsSolved: [],
                    problemsUnsolved: [],
                    contestant: user._id,
                    contestants: null,
                    contestID: contest._id
                };

                let createTracker = new this.trackers(tracker);
                await createTracker.save();

                let saveStanding = new this.standings(standing);
                saveStanding.trackers.push(createTracker._id);
                await saveStanding.save();

                let saveContest = new this.contests(contest);
                saveContest.users.push(user._id);
                await saveContest.save();

                let saveUser = new this.users(user);
                saveUser.contests.push(contestID);
                await saveUser.save();

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
                        name: "Couldn't register the user to the contest"
                    }
                });
            }
        });
    }

    /**
     * Verify if the contest with this ID exists
     * @param contestID 
     */
    private contestExists(contestID: string): Promise<Contests> {
        return new Promise<Contests>(async (resolve, reject) => {
            let contest: Contests;

            try {
                contest = await this.contests.findById(contestID).exec();
                return resolve(contest);
            }
            catch(err) {
                return reject(err);
            }
        });
    }

    /**
     * Verify if the user with this ID exists
     * @param userID 
     */
    private userExists(userID: string): Promise<Users> {
        return new Promise<Users>(async (resolve, reject) => {
            let user: Users;

            try {
                user = await this.users.findById(userID).exec();
                return resolve(user);
            }
            catch(err) {
                return reject(err);
            }
        });
    }

    /**
     * Verify if the user is already registered to the contest
     * so that he(she) cannot register more than once
     * @param user 
     * @param contestID 
     */
    private isUserAlreadyRegistered(user: Users, contestID: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let contests: any[] = user.contests;
            let isRegistered = false;

            for (let i = 0; i < contests.length; i++) {
                if (contests[i] == contestID) {
                    isRegistered = true;
                    break;
                }
            }
            return resolve(isRegistered);
        });
    }

    /**
     * @description unregister a user or a team from the contest
     * @param contestID 
     * @param userID
     */
    unregister(contestID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let user: Users;
            let tracker: Trackers;
            let standing: Standings;

            try {
                let admin = await this.isAdmin(contestID, userID);
                contest = await this.contestExists(contestID);
                if (!contest) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "CONTEST ID Not Found"
                        }
                    });
                }
                if (contest.type != ContestType.INDIVIDUAL) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "This is not an individual contest"
                        }
                    });
                }
                user = await this.userExists(userID);

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "USER ID Not Found"
                        }
                    });
                }
                tracker = await this.trackers.findOneAndRemove({contestID: contestID, contestant: user._id}).exec();

                standing = await this.standings.findOne({contestID: contest._id}).exec();

                let saveStanding = new this.standings(standing);
                let saveUser = new this.users(user);
                let saveContest = new this.contests(contest);

                saveStanding.trackers = saveStanding.trackers.filter((track: string) => track != tracker._id);
                await saveStanding.save();

                if (!admin) {
                    saveUser.contests = saveUser.contests.filter((cont: string) => cont != contestID);
                    await saveUser.save();
                }

                saveContest.users = saveContest.users.filter((us: string) => us != userID);
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
                        name: "Couldn't unregister the user from the contest"
                    }
                });
            }
        });
    }
    
    /**
     * @description update the contest standing
     * @param contestID 
     */
    updateStanding(contestID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let standing: Standings;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate("users")
                                             .populate("problems")
                                             .exec();

                let shouldBeUpdated: boolean = await this.shouldUpdate(contest.startDate, contest.endDate);

                if (!shouldBeUpdated) {
                    return reject({
                        code: HTTPStatusCodes.NOT_MODIFIED,
                        body: {
                            name: "Contest is either not started yet or ended"
                        }
                    });
                }

                await this.queryProblems(contest);

                standing = await this.standings.findById(contest.standings)
                                               .populate("trackers")
                                               .exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: standing
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

    /**
     * @description iterate over each problem of the contest
     * @param contest 
     */
    private queryProblems(contest: Contests): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {

            try {
                console.log('INSIDE QUERY PROBLEMS');
                for (let i = 0; i < contest.problems.length; i++) {
                    console.log("problem (", i, ") ", contest.problems[i]);
                    await this.queryUsers(contest, contest.problems[i]);
                }
                return resolve();
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    /**
     * @description iterate over each user to see if they solved (or tried to solve) a problem 
     * @param problem 
     * @param contest
     */
    private queryUsers(contest: Contests, problem: any): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let plateform: Plateform;
            const name: string = problem.plateform;
            plateform = this.plateformBuilder.createPlateform(name);
            let result: InsightResponse;
            let statusFiltered: any[];
            try {
                console.log('INSIDE QUERY USERS');
                for (let i = 0; i < contest.users.length; i++) {
                    let user: any = contest.users[i];
                    result = await plateform.updateContest(contest, user, problem);
                    console.log("user (", i, ") ", result);
                    statusFiltered = result.body.result;
                    await this.querySubmissions(contest, problem, user, statusFiltered, plateform);
                }
                return resolve();
            }
            catch (err) {
                console.log("ERROR: ", err);
                return reject(err);
            }
        });
    }

    /**
     * @description iterate over all user submissions during the contest and check the verdict
     * @param contest 
     * @param problem 
     * @param user 
     * @param status 
     */
    private querySubmissions(contest: Contests, problem: any, user: any, status: any[], plateform: Plateform): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                console.log('INSIDE QUERY SUBMISSIONS');
                for (let i = 0; i < status.length; i++) {
                    await this.getSubmission(contest, user, problem, status[i], plateform);
                }
                return resolve();
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    /**
     * @description retrieve a specific submission from the specified platform
     * @param contest 
     * @param user 
     * @param problem 
     * @param sub 
     */
    private getSubmission(contest: Contests, user: any, problem: any, sub: any, platform: Plateform): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let tracker: Trackers;

            try {
                let submission: Submissions = await platform.getSubmission(sub);
                if (problem.problemID == submission.problemID) {
                    let new_sub: Submissions = await this.submissions.findOne(
                        {
                            problemID: submission.problemID,
                            OJ: submission.OJ,
                            submissionID: submission.submissionID
                        }
                    ).exec();
                    if (!new_sub) {
                        submission.problemLink = problem.link;
                        submission.user = user._id;
                        
                        
                        tracker = await this.trackers.findOne({
                            contestant: user._id,
                            contestID: contest._id
                        }).exec();
                        let saveTracker = new this.trackers(tracker);
                        for (let i = 0; i < saveTracker.problemsSolved.length; i++) {
                            let prblm: string = saveTracker.problemsSolved[i] + "";
                            console.log("SOLVED AND UNSOLVED: ", prblm, " ", problem._id);
                            if (prblm == (problem._id + "")) {
                                console.log("INSIDE");
                                return resolve();
                            }
                        }
                        let shouldSave: boolean = true;
                        for (let i = 0; i < saveTracker.problemsUnsolved.length; i++) {
                            let prblm: string = saveTracker.problemsUnsolved[i] + "";
                            if (prblm == (problem._id + "")) {
                                shouldSave = false;
                            }
                        }
                        let createSubmission = new this.submissions(submission);
                        await createSubmission.save();
                        if (submission.verdict != "ACCEPTED") {
                            if (shouldSave) {
                                saveTracker.problemsUnsolved.push(problem._id);
                            }
                        }
                        else {
                            let diff = (submission.submissionTime.getTime() - contest.startDate.getTime()) / 6000;
                            saveTracker.penalty += Math.round(diff);
                            saveTracker.solvedCount += 1;
                            saveTracker.problemsSolved.push(problem._id);
                            saveTracker.problemsUnsolved = saveTracker.problemsUnsolved.filter((pr: string) => pr != problem._id);
                        }
                        await saveTracker.save();
                    }
                }
                return resolve();
            }
            catch (err) {
                return reject(err);
            }
        });
    }
}