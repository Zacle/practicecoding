import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Contests } from "../../models/contests/Contests";
import { Standings } from "../../models/contests/Standings";
import { Submissions } from "../../models/contests/Submissions";
import { Trackers } from "../../models/contests/Trackers";
import { Groups } from "../../models/Groups";
import { InsightResponse, AccessType, IContest, ContestType } from "../../interfaces/InterfaceFacade";
import { ContestsService } from "./Contests.service";
import { Users } from "../../models/Users";
import PlateformBuilding from "../../services/plateformBuilder/PlateformBuilding.service";
import { Teams } from "../../models/Teams";
import { Plateform } from "../plateform/Plateform.service";
import { Problems } from "../../models/Problems";


@Service()
export class TeamContestService extends ContestsService {

    constructor(@Inject(Contests) protected contests: MongooseModel<Contests>,
                @Inject(Submissions) protected submissions: MongooseModel<Submissions>,
                @Inject(Standings) protected standings: MongooseModel<Standings>,
                @Inject(Users) protected users: MongooseModel<Users>,
                @Inject(Teams) protected teams: MongooseModel<Teams>,
                @Inject(Trackers) protected trackers: MongooseModel<Trackers>,
                @Inject(Groups) protected groups: MongooseModel<Groups>,
                protected plateformBuilder: PlateformBuilding) {

                super(contests, submissions, standings, users, trackers, groups, plateformBuilder);
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
                type: ContestType.TEAM,
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
                await createdContest.save();

                let standing: Standings = {
                    trackers: [],
                    contestID: createdContest._id
                };

                let createStanding = new this.standings(standing);
                await createStanding.save();

                createdContest.standings = createStanding._id;
                await createdContest.save();

                let saveUser = new this.users(user);
                saveUser.contests.push(createdContest._id);
                await saveUser.save();

                resolve({
                    code: HTTPStatusCodes.CREATED,
                    body: {
                        result: createdContest
                    }
                });
            }
            catch (err) {
                reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't create the contest"
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
                type: ContestType.TEAM,
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

                resolve({
                    code: HTTPStatusCodes.CREATED,
                    body: {
                        result: createdContest
                    }
                });
            }
            catch (err) {
                reject({
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
    getSubmissions(contestID: string, page: number): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            const size = 15;

            try {
                contest = await this.contests.findById(contestID)
                                             .populate({
                                                 path: "submissions",
                                                 populate: {
                                                     path: "team",
                                                     populate: {
                                                         path: "members"
                                                     }
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
                reject({
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
                                             .populate({
                                                path: "teams",
                                                populate: {
                                                    path: "members"
                                                }
                                             })
                                             .limit(size)
                                             .skip(size * (page - 1))
                                             .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contest.teams
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
                                                       path: "contestants"
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
     * @param teamID
     */
    register(contestID: string, teamID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let team: Teams;
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

                if (contest.type != ContestType.TEAM) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "This is not a team contest"
                        }
                    });
                }
                
                team = await this.teamExists(teamID);

                if (!team) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "TEAM ID Not Found"
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
                let isRegistered: boolean = await this.isTeamAlreadyRegistered(team, contestID);
                if (isRegistered) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "Team already registered to the contest"
                        }
                    });
                }
                standing = await this.standings.findOne({contestID: contest._id}).exec();

                tracker = {
                    country: null,
                    solvedCount: 0,
                    penalty: 0,
                    problemsSolved: [],
                    problemsUnsolved: [],
                    contestant: null,
                    contestants: team._id,
                    contestID: contest._id
                };

                let createTracker = new this.trackers(tracker);
                await createTracker.save();

                let saveStanding = new this.standings(standing);
                saveStanding.trackers.push(createTracker._id);
                await saveStanding.save();

                let saveContest = new this.contests(contest);
                saveContest.teams.push(team._id);
                await saveContest.save();

                let saveTeam = new this.teams(team);
                saveTeam.contests.push(contest._id);
                await saveTeam.save();

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
                        name: "Couldn't register the team to the contest"
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
     * Verify if the team with this ID exists
     * @param teamID 
     */
    private teamExists(teamID: string): Promise<Teams> {
        return new Promise<Teams>(async (resolve, reject) => {
            let team: Teams;

            try {
                team = await this.teams.findById(teamID).exec();
                return resolve(team);
            }
            catch(err) {
                return reject(err);
            }
        });
    }

    /**
     * Verify if the team is already registered to the contest
     * so that it cannot register more than once
     * @param team 
     * @param contestID 
     */
    private isTeamAlreadyRegistered(team: Teams, contestID: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let contests: any[] = team.contests;
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
     * @param teamID
     */
    unregister(contestID: string, teamID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let team: Teams;
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
                if (contest.type != ContestType.TEAM) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "This is not a team contest"
                        }
                    });
                }
                team = await this.teamExists(teamID);
                if (!team) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "TEAM ID Not Found"
                        }
                    });
                }
                tracker = await this.trackers.findOneAndRemove({contestID: contestID, contestants: team._id}).exec();

                standing = await this.standings.findOne({contestID: contest._id}).exec();

                let saveStanding = new this.standings(standing);
                let saveTeam = new this.teams(team);
                let saveContest = new this.contests(contest);

                saveStanding.trackers = saveStanding.trackers.filter((track: string) => track != tracker._id);
                await saveStanding.save();

                saveTeam.contests = saveTeam.contests.filter((cont: string) => cont != contestID);
                await saveTeam.save();

                saveContest.teams = saveContest.teams.filter((us: string) => us != teamID);
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
                        name: "Couldn't unregister the team from the contest"
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
                                             .populate({
                                                path: "teams",
                                                populate: {
                                                    path: "members"
                                                }
                                             })
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
                contest.teams.forEach((team: Teams) => {
                    team.members.forEach(async (user: Users) => {
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
                                        submission.team = team._id;
                                        let createSubmission = new this.submissions(submission);
                                        await createSubmission.save();
                                        tracker = await this.trackers.findOne({
                                            contestants: team._id,
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
            });
            return resolve();
        });
    }
}