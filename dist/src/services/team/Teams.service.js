"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Users_1 = require("../../models/Users");
const Teams_1 = require("../../models/Teams");
let TeamsService = class TeamsService {
    constructor(teams, users) {
        this.teams = teams;
        this.users = users;
    }
    /**
     * Create a new team and a user as the admin
     * @param name name of the team
     * @param user team owner
     */
    createTeam(name, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team = {
                    name: name,
                    admin: userID,
                    creation: new Date(),
                    contests: [],
                    members: []
                };
                let result;
                let total;
                try {
                    total = yield this.teams.find({}).count().exec();
                    team.name = (total + 1) + " - " + name;
                    let exist = yield this.exists(team.name);
                    if (exist) {
                        return reject({
                            code: 409 /* CONFLICT */,
                            body: {
                                name: "Team name already exists"
                            }
                        });
                    }
                    yield this.teams.create(team);
                    result = yield this.teams.findOne({ name: team.name }, "-__v").exec();
                    if (result) {
                        let ans;
                        ans = yield this.addTeamMember(result._id, userID);
                        return resolve(ans);
                    }
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't create a team"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't create a team"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if a team with this name already exist
     * @param name
     */
    exists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    result = yield this.teams.findOne({ name: name }).exec();
                    if (result) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
                catch (err) {
                    return reject(err);
                }
            }));
        });
    }
    /**
     * Return all teams that contain the user
     * @param username
     */
    getTeams(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                try {
                    team = yield this.users.findOne({ username: username }, "-__v")
                        .populate({
                        path: "teams",
                        populate: {
                            path: "admin"
                        }
                    })
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: team.teams || []
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get your team"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return all teams that contain the user and he(her) is the admin
     * @param username
     */
    getMyTeams(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                let myTeams = [];
                try {
                    team = yield this.users.findOne({ username: username }, "-__v")
                        .populate({
                        path: "teams",
                        populate: {
                            path: "admin"
                        }
                    })
                        .exec();
                    for (let i = 0; i < team.teams.length; i++) {
                        let current = team.teams[i];
                        if (current.admin.username == username) {
                            myTeams.push(current);
                        }
                    }
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: myTeams
                        }
                    });
                }
                catch (err) {
                    console.log("ERROR: ", err);
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get your team"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return all teams of the web app
     */
    getAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                try {
                    team = yield this.teams.find({}, "-__v")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: team || []
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Delete all teams registered in the website
     * @requires website admin authorization
     */
    deleteTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                try {
                    yield this.teams.find({}).remove().exec();
                    team = yield this.teams.find({}).exec();
                    if (team) {
                        return reject({
                            code: 400 /* BAD_REQUEST */,
                            body: {
                                name: "Couldn't delete all teams"
                            }
                        });
                    }
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: team
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return a team identified by id
     * @param id the team id to return
     */
    getTeam(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                try {
                    team = yield this.teams.findById(id, "-__v")
                        .populate("admin")
                        .populate("members")
                        .exec();
                    if (team) {
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: team
                            }
                        });
                    }
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Team ID not found"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get the team"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Delete a team identified by id
     * @param id the team id to delete
     * @requires team's admin authorization
     */
    deleteam(id, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                try {
                    const admin = yield this.isAdmin(id, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to delete this team"
                            }
                        });
                    }
                    team = yield this.teams.findById(id, "-__v").exec();
                    if (team) {
                        team = yield this.deleteUserTeam(team);
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: team
                            }
                        });
                    }
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Team id not found"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * For each user in the team remove him(her) from the team
     * @param team
     */
    deleteUserTeam(team) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                let IDs = [...team.members];
                try {
                    yield IDs.forEach((id) => __awaiter(this, void 0, void 0, function* () {
                        user = yield this.users.findByIdAndUpdate(id, { $pull: { teams: { _id: id } } }).exec();
                    }));
                    team = yield this.teams.findByIdAndRemove(team._id);
                    resolve(team);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    /**
     * Verify if the user is the team admin
     * @param teamID
     * @param userID
     */
    isAdmin(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let team;
                try {
                    team = yield this.teams.findById(teamID, "-__v").exec();
                    if (team) {
                        if (team.admin.toString() == userID.toString())
                            return resolve(true);
                        return resolve(false);
                    }
                    return resolve(false);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    /**
     * Return all users in this team
     * @param id the team id to query
     */
    getTeamMembers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let members;
                try {
                    members = yield this.teams.findById(id)
                        .populate("members")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: members.members
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Get all contests this team has participated in
     * @param id the team id to query
     */
    getTeamContests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                try {
                    contests = yield this.teams.findById(id)
                        .populate("contests")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: contests.contests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Add a user to the team and
     * Add the team to the user's teams list
     * @param teamID team id to query
     * @param userID user to add
     */
    addTeamMember(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                let team;
                try {
                    user = yield this.users.findById(userID, "-__v").exec();
                    if (!user) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "User ID doesn't exist"
                            }
                        });
                    }
                    team = yield this.teams.findById(teamID, "-__v").exec();
                    if (!team) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Team ID doesn't exist"
                            }
                        });
                    }
                    let isInTheTeam = yield this.isUserAlreadyInTheTeam(user, teamID);
                    if (isInTheTeam) {
                        return reject({
                            code: 409 /* CONFLICT */,
                            body: {
                                name: "User is already in the team"
                            }
                        });
                    }
                    user.teams.push(teamID);
                    team.members.push(userID);
                    const saveUser = new this.users(user);
                    yield saveUser.save();
                    const saveTeam = new this.teams(team);
                    yield saveTeam.save();
                    team = yield this.teams.findById(teamID, "-__v").populate("admin").populate("members").exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: team
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if the user is already in the team
     * so that he(she) cannot be added more than once
     * @param user
     * @param teamID
     */
    isUserAlreadyInTheTeam(user, teamID) {
        return new Promise((resolve) => {
            let teams = user.teams;
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
    deleteTeamMember(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                let team;
                try {
                    user = yield this.users.findById(userID, "-__v").exec();
                    if (!user) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "User ID doesn't exist"
                            }
                        });
                    }
                    team = yield this.teams.findById(teamID, "-__v").exec();
                    if (!team) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Team ID doesn't exist"
                            }
                        });
                    }
                    let userArray = user.teams.filter((id) => id.toString() != teamID.toString());
                    user.teams = [...userArray];
                    let teamArray = team.members.filter((id) => id.toString() != userID.toString());
                    team.members = [...teamArray];
                    const saveUser = new this.users(user);
                    yield saveUser.save();
                    const saveTeam = new this.teams(team);
                    yield saveTeam.save();
                    team = yield this.teams.findById(teamID, "-__v").populate("admin").populate("members").exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: team
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
};
TeamsService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Teams_1.Teams)),
    __param(1, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object, Object])
], TeamsService);
exports.TeamsService = TeamsService;
//# sourceMappingURL=Teams.service.js.map