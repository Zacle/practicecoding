import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { API_ERRORS } from "../../util/app.error";
import { Users } from "../../models/Users";
import { Teams } from "../../models/Teams";
import { InsightResponse } from "../../interfaces/InterfaceFacade";

@Service()
export class TeamsService {

    constructor(@Inject(Teams) private teams: MongooseModel<Teams>,
                @Inject(Users) private users: MongooseModel<Users>) {}

    /**
     * Create a new team and a user as the admin
     * @param name name of the team
     * @param user team owner
     */
    async createTeam(name: string, userID: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let team: Teams = {
                name: name,
                admin: userID,
                creation: new Date(),
                contests: [],
                members: []
            };
    
            let result: Teams;
    
            try {

                let exist: boolean = await this.exists(name);

                if (exist) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "Team name already exists"
                        }
                    });
                }
                await this.teams.create(team);
    
                result = await this.teams.findOne({name: name}, "-__v").exec();
    
                if (result) {
                    let ans: InsightResponse;
                    ans = await this.addTeamMember(result._id, userID);
                    return resolve(ans);
                }
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't create a team"
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't create a team"
                    }
                });
            }
        });
    }

    /**
     * Verify if a team with this name already exist
     * @param name 
     */
    private async exists(name: string): Promise<boolean> {

        let result: any;

        return new Promise<boolean>(async (resolve, reject) => {
            try {
                result = await this.teams.findOne({name: name}).exec();

                if (result) {
                    return resolve(true);
                }

                return resolve(false);
            }
            catch(err) {
                return reject(err);
            }
        });
    }

    /**
     * Return all teams that contain the user
     * @param username
     */
    async getTeams(username: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let team: Users;

            try {
                team = await this.users.findOne({username: username}, "-__v")
                                        .populate({
                                            path: "teams",
                                            populate: {
                                                path: "admin"
                                            }
                                        })
                                        .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: team.teams || []
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get your team"
                    }
                });
            }
        });
    }

    /**
     * Return all teams that contain the user and he(her) is the admin
     * @param username
     */
    async getMyTeams(username: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let team: Users;
            let myTeams: Teams[] = [];

            try {
                team = await this.users.findOne({username: username}, "-__v")
                                        .populate({
                                            path: "teams",
                                            populate: {
                                                path: "admin"
                                            }
                                        })
                                        .exec();

                    for (let i = 0; i < team.teams.length; i++) {
                        let current: any = team.teams[i];
                        if (current.admin.username == username) {
                            myTeams.push(current);
                        }
                    }

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: myTeams
                    }
                });
            }
            catch (err) {
                console.log("ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get your team"
                    }
                });
            }
        });
    }

    /**
     * Return all teams of the web app
     */
    async getAllTeams(): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let team: Teams[];

            try {
                team = await this.teams.find({}, "-__v")
                                        .exec();
                
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: team || []
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
     * Delete all teams registered in the website
     * @requires website admin authorization
     */
    async deleteTeams(): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let team: Teams[];

            try {
                await this.teams.find({}).remove().exec();

                team = await this.teams.find({}).exec();

                if (team) {
                    return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Couldn't delete all teams"
                        }
                    });
                }
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: team
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
     * Return a team identified by id
     * @param id the team id to return
     */
    async getTeam(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            
            let team: Teams;
            
            try {
                team = await this.teams.findById(id, "-__v")
                                       .populate("admin")
                                       .populate("members")
                                       .exec();

                if (team) {
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: team
                        }
                    });
                }

                return reject({
                    code: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Team ID not found"
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the team"
                    }
                });
            }
        });
    }

    /**
     * Delete a team identified by id
     * @param id the team id to delete
     * @requires team's admin authorization
     */
    async deleteam(id: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let team: Teams;

            try {
                const admin: boolean = await this.isAdmin(id, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to delete this team"
                        }
                    });
                }
                
                team = await this.teams.findById(id, "-__v").exec();

                if (team) {
                    team = await this.deleteUserTeam(team);
                    
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: team
                        }
                    });
                }
                return reject({
                    code: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Team id not found"
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
     * For each user in the team remove him(her) from the team
     * @param team 
     */
    private async deleteUserTeam(team: Teams): Promise<Teams> {
        return new Promise<Teams>(async (resolve, reject) => {
            let user: Users;
            
            let IDs: any[] = [...team.members];
            try {
                await IDs.forEach(async id => {
                    user = await this.users.findByIdAndUpdate(
                        id,
                        {$pull: {teams: {_id: id}}}
                    ).exec();
                });
                team = await this.teams.findByIdAndRemove(team._id);
                resolve(team);
            }
            catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Verify if the user is the team admin
     * @param teamID 
     * @param userID 
     */
    private async isAdmin(teamID: string, userID: string): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {
            let team: Teams;
            try {
                team = await this.teams.findById(teamID, "-__v").exec();
                if (team) {
                    if (team.admin.toString() == userID.toString())
                        return resolve(true);
                    return resolve(false);
                }
                return resolve(false);
            }
            catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Return all users in this team
     * @param id the team id to query
     */
    async getTeamMembers(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let members: Teams;

            try {
                members = await this.teams.findById(id)
                                            .populate("members")
                                            .exec();
                
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: members.members
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
     * Get all contests this team has participated in
     * @param id the team id to query
     */
    async getTeamContests(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Teams;

            try {
                contests = await this.teams.findById(id)
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
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Add a user to the team and
     * Add the team to the user's teams list
     * @param teamID team id to query
     * @param userID user to add
     */
    async addTeamMember(teamID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let user: Users;
            let team: Teams;

            try {
                user = await this.users.findById(userID, "-__v").exec();

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "User ID doesn't exist"
                        }
                    });
                }

                team = await this.teams.findById(teamID, "-__v").exec();

                if (!team) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Team ID doesn't exist"
                        }
                    });
                }

                let isInTheTeam: boolean = await this.isUserAlreadyInTheTeam(user, teamID);
                if (isInTheTeam) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "User is already in the team"
                        }
                    });
                }

                user.teams.push(teamID);
                team.members.push(userID);

                const saveUser = new this.users(user);
                await saveUser.save();

                const saveTeam = new this.teams(team);
                await saveTeam.save();

                team = await this.teams.findById(teamID, "-__v").populate("admin").populate("members").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: team
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
     * Verify if the user is already in the team
     * so that he(she) cannot be added more than once
     * @param user 
     * @param teamID 
     */
    private isUserAlreadyInTheTeam(user: Users, teamID: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let teams: any[] = user.teams;
            let isRegistered = false;

            for (let i = 0; i < teams.length; i++) {
                if (teams[i] == teamID) {
                    isRegistered = true;
                    break;
                }
            }
            return resolve(isRegistered);
        });
    }

    /**
     * Remove a user from the team
     * @param teamID the team id to query
     * @param userID user to remove from the team
     */
    async deleteTeamMember(teamID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let user: Users;
            let team: Teams;

            try {
                user = await this.users.findById(userID, "-__v").exec();

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "User ID doesn't exist"
                        }
                    });
                }

                team = await this.teams.findById(teamID, "-__v").exec();

                if (!team) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Team ID doesn't exist"
                        }
                    });
                }

                let userArray: any[] = user.teams.filter((id) => id.toString() != teamID.toString());
                user.teams = [...userArray];
                let teamArray: any[] = team.members.filter((id) => id.toString() != userID.toString());
                team.members = [...teamArray];

                const saveUser = new this.users(user);
                
                await saveUser.save();

                const saveTeam = new this.teams(team);
                await saveTeam.save();

                team = await this.teams.findById(teamID, "-__v").populate("admin").populate("members").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: team
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
}