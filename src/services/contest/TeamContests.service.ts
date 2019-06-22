import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Contests } from "../../models/contests/Contests";
import { Standings } from "../../models/contests/Standings";
import { Submissions } from "../../models/contests/Submissions";
import { InsightResponse, AccessType, IContest, ContestType } from "../../interfaces/InterfaceFacade";
import { ContestsService } from "./Contests.service";
import { Users } from "../../models/Users";
import PlateformBuilding from "../../services/plateformBuilder/PlateformBuilding.service";
import { Teams } from "src/models/Teams";


@Service()
export class TeamContestService extends ContestsService {

    constructor(@Inject(Contests) protected contests: MongooseModel<Contests>,
                @Inject(Submissions) protected submissions: MongooseModel<Submissions>,
                @Inject(Standings) protected standings: MongooseModel<Standings>,
                @Inject(Users) protected users: MongooseModel<Users>,
                @Inject(Teams) protected teams: MongooseModel<Teams>,
                protected plateformBuilder: PlateformBuilding) {

                super(contests, submissions, standings, users, plateformBuilder);
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
                type: ContestType.TEAM,
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
    protected getSubmissions(contestID: string, page: number): Promise<InsightResponse> {
        
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
    protected getRegistrants(contestID: string, page: number): Promise<InsightResponse> {
        
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
    protected register(contestID: string, teamID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let team: Teams;

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
                
                team = await this.teamExists(teamID);

                if (!team) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "TEAM ID Not Found"
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
     * @description unregister a user or a team from the contest
     * @param contestID 
     * @param teamID
     */
    protected unregister(contestID: string, teamID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contest: Contests;
            let team: Teams;

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
                team = await this.teamExists(teamID);
                if (!team) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "TEAM ID Not Found"
                        }
                    });
                }
                team = await this.teams.findByIdAndUpdate(teamID,
                    {$pull: {contests: {_id: contestID}}}
                    ).exec();

                contest = await this.contests.findByIdAndUpdate(contestID,
                    {$pull: {teams: {_id: teamID}}}
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
                        name: "Couldn't unregister the team from the contest"
                    }
                });
            }
        });
    }

    protected addSubmission(contestID: string, submission: any, userID: string): Promise<InsightResponse> {
        throw new Error("Method not implemented.");
    }

    protected updateStanding(contestID: string): Promise<InsightResponse> {
        throw new Error("Method not implemented.");
    }

    
}