import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Contests } from "../../models/contests/Contests";
import { Standings } from "../../models/contests/Standings";
import { Submissions } from "../../models/contests/Submissions";
import { Trackers } from "../../models/contests/Trackers";
import { Problems } from "../../models/Problems";
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
                protected plateformBuilder: PlateformBuilding) {

                super(contests, submissions, standings, users,trackers, plateformBuilder);
    }

    /**
     * Create a new Contest
     * @param contest
     */
    protected create(contest: IContest): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let startDate = new Date(contest.startDateYear, contest.startDateMonth - 1, contest.startDateDay, contest.startTimeHour, contest.startTimeMinute);
            let endDate = new Date(contest.endDateYear, contest.endDateMonth - 1, contest.endDateDay, contest.endTimeHour, contest.endTimeMinute);
            let duration: string = super.duration(startDate, endDate);

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
                let createdContest = new this.contests(new_contest);
                await createdContest.save();

                let standing: Standings = {
                    trackers: [],
                    contestID: createdContest._id
                };

                let createStanding = new this.standings(standing);
                await createStanding.save();

                createdContest.standings = createStanding._id;
                await createdContest.save();

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
                        name: "Couldn't create the contest"
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
    protected getSubmissions(contestID: string, page: number): Promise<InsightResponse> {
        
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
    protected getRegistrants(contestID: string, page: number): Promise<InsightResponse> {
        
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
    protected getStanding(contestID: string, page: number): Promise<InsightResponse> {
        
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
     * @description register a user or a team to the contest
     * @param contestID 
     * @param userID
     */
    protected register(contestID: string, userID: string): Promise<InsightResponse> {
        
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
                user = await this.userExists(userID);

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "USER ID Not Found"
                        }
                    });
                }
                let date = new Date();
                if (contest.endDate < date) {
                    return reject({
                        code: HTTPStatusCodes.FORBIDDEN,
                        body: {
                            name: "This contest is over"
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
                saveStanding.trackers.push(tracker._id);
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
     * @description unregister a user or a team from the contest
     * @param contestID 
     * @param userID
     */
    protected unregister(contestID: string, userID: string): Promise<InsightResponse> {
        
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

                standing = await this.standings.findOneAndUpdate(
                    {contestID: contest._id},
                    {$pull: {trackers: {_id: tracker._id}}}
                ).exec();

                user = await this.users.findByIdAndUpdate(userID,
                    {$pull: {contests: {_id: contestID}}}
                    ).exec();

                contest = await this.contests.findByIdAndUpdate(contestID,
                    {$pull: {users: {_id: userID}}}
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
    protected updateStanding(contestID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let standing: Standings;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate("users")
                                             .populate("problems")
                                             .exec();
                await this.query(contest);

                standing = await this.standings.findOne({contestID: contest._id})
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
                    code: HTTPStatusCodes.OK,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * @description iterate over each problem and each user to update the standing
     * @param contest 
     */
    private query(contest: Contests): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let plateform: Plateform;
            let tracker: Trackers;

            contest.problems.forEach((problem: Problems) => {
                contest.users.forEach(async (user: Users) => {
                    const name: string = problem.name;
                    plateform = this.plateformBuilder.createPlateform(name);
                    let result: InsightResponse;
                    let statusFiltered: any[];

                    try {
                        result = await plateform.updateContest(contest, user, problem);
                        statusFiltered = result.body.result;
                        statusFiltered.forEach(async (sub) => {
                            let submission: Submissions = await plateform.getSubmission(sub);
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
                                    let createSubmission = new this.submissions(submission);
                                    await createSubmission.save();
                                    tracker = await this.trackers.findOne({
                                        contestant: user._id,
                                        contestID: contest._id
                                    }).exec();
                                    let saveTracker = new this.trackers(tracker);
                                    if (submission.verdict != "ACCEPTED") {
                                        saveTracker.problemsUnsolved.push(problem._id);
                                    }
                                    else {
                                        let diff = (submission.submissionTime.getTime() - contest.startDate.getTime()) / 6000;
                                        saveTracker.penalty += diff;
                                        saveTracker.solvedCount += 1;
                                        saveTracker.problemsSolved.push(problem._id);
                                        saveTracker.problemsUnsolved = saveTracker.problemsUnsolved.filter((pr) => problem._id != pr);
                                    }
                                    await saveTracker.save();
                                }
                            }
                        });
                    }
                    catch(err) {
                        reject(err);
                    }
                });
            });
            return resolve();
        });
    }

}