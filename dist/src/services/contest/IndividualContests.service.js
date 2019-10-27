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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Contests_1 = require("../../models/contests/Contests");
const Standings_1 = require("../../models/contests/Standings");
const Submissions_1 = require("../../models/contests/Submissions");
const Trackers_1 = require("../../models/contests/Trackers");
const Groups_1 = require("../../models/Groups");
const InterfaceFacade_1 = require("../../interfaces/InterfaceFacade");
const Contests_service_1 = require("./Contests.service");
const Users_1 = require("../../models/Users");
const PlateformBuilding_service_1 = __importDefault(require("../../services/plateformBuilder/PlateformBuilding.service"));
let IndividualContestService = class IndividualContestService extends Contests_service_1.ContestsService {
    constructor(contests, submissions, standings, users, trackers, groups, plateformBuilder) {
        super(contests, submissions, standings, users, trackers, groups, plateformBuilder);
        this.contests = contests;
        this.submissions = submissions;
        this.standings = standings;
        this.users = users;
        this.trackers = trackers;
        this.groups = groups;
        this.plateformBuilder = plateformBuilder;
    }
    /**
     * Create a new Contest
     * @param contest
     * @param userID
     */
    create(contest, userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let startDate = new Date(contest.startDateYear, contest.startDateMonth - 1, contest.startDateDay, contest.startTimeHour, contest.startTimeMinute);
            let endDate = new Date(contest.endDateYear, contest.endDateMonth - 1, contest.endDateDay, contest.endTimeHour, contest.endTimeMinute);
            let duration = this.duration(startDate, endDate);
            let total;
            let new_contest = {
                name: contest.name,
                startDate: startDate,
                endDate: endDate,
                duration: duration,
                owner: contest.owner,
                access: contest.access,
                type: InterfaceFacade_1.ContestType.INDIVIDUAL,
                problems: [],
                users: [],
                teams: [],
                submissions: [],
                standings: null
            };
            try {
                total = yield this.contests.find({}).count().exec();
                new_contest.name = (total + 1) + " - " + contest.name;
                let exist = yield this.exists(new_contest.name);
                if (exist) {
                    return reject({
                        code: 409 /* CONFLICT */,
                        body: {
                            name: "Contest name already exists"
                        }
                    });
                }
                let isValid = yield this.isValidDate(startDate, endDate);
                if (!isValid) {
                    return reject({
                        code: 406 /* NOT_ACCEPTABLE */,
                        body: {
                            name: "Start date and End date are not valid"
                        }
                    });
                }
                let solved = [];
                let unSolved = [];
                for (let i = 0; i < 151; i++) {
                    solved.push(0);
                    unSolved.push(0);
                }
                let user = yield this.users.findById(userID).exec();
                let createdContest = new this.contests(new_contest);
                createdContest.users.push(user._id);
                yield createdContest.save();
                let tracker;
                tracker = {
                    country: user.country,
                    solvedCount: 0,
                    penalty: 0,
                    solved: solved,
                    unSolved: unSolved,
                    contestant: user._id,
                    contestants: null,
                    contestID: createdContest._id
                };
                let createTracker = new this.trackers(tracker);
                yield createTracker.save();
                let standing = {
                    trackers: [createTracker],
                    contestID: createdContest._id
                };
                let createStanding = new this.standings(standing);
                yield createStanding.save();
                createdContest.standings = createStanding._id;
                yield createdContest.save();
                let saveUser = new this.users(user);
                saveUser.contests.push(createdContest._id);
                yield saveUser.save();
                return resolve({
                    code: 201 /* CREATED */,
                    body: {
                        result: createdContest
                    }
                });
            }
            catch (err) {
                console.log("ERROR: ", err);
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't create the contest"
                    }
                });
            }
        }));
    }
    /**
     * Create a new group contest
     * @param contest
     * @param groupID
     * @param userID
     */
    createGroupContest(contest, groupID, userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let startDate = new Date(contest.startDateYear, contest.startDateMonth - 1, contest.startDateDay, contest.startTimeHour, contest.startTimeMinute);
            let endDate = new Date(contest.endDateYear, contest.endDateMonth - 1, contest.endDateDay, contest.endTimeHour, contest.endTimeMinute);
            let duration = this.duration(startDate, endDate);
            let new_contest = {
                name: contest.name,
                startDate: startDate,
                endDate: endDate,
                duration: duration,
                owner: contest.owner,
                access: contest.access,
                type: InterfaceFacade_1.ContestType.INDIVIDUAL,
                problems: [],
                users: [],
                teams: [],
                submissions: [],
                standings: null
            };
            let group;
            let total;
            try {
                total = yield this.contests.find({}).count().exec();
                new_contest.name = (total + 1) + " - " + contest.name;
                let exist = yield this.exists(new_contest.name);
                if (exist) {
                    return reject({
                        code: 409 /* CONFLICT */,
                        body: {
                            name: "Contest name already exists"
                        }
                    });
                }
                let isValid = yield this.isValidDate(startDate, endDate);
                if (!isValid) {
                    return reject({
                        code: 406 /* NOT_ACCEPTABLE */,
                        body: {
                            name: "Start date and End date are not valid"
                        }
                    });
                }
                let solved = [];
                let unSolved = [];
                for (let i = 0; i < 151; i++) {
                    solved.push(0);
                    unSolved.push(0);
                }
                let user = yield this.users.findById(userID).exec();
                group = yield this.groups.findById(groupID).exec();
                let createdContest = new this.contests(new_contest);
                createdContest.users.push(user._id);
                yield createdContest.save();
                let tracker;
                tracker = {
                    country: user.country,
                    solvedCount: 0,
                    penalty: 0,
                    solved: solved,
                    unSolved: unSolved,
                    contestant: user._id,
                    contestants: null,
                    contestID: createdContest._id
                };
                let createTracker = new this.trackers(tracker);
                yield createTracker.save();
                let standing = {
                    trackers: [createTracker],
                    contestID: createdContest._id
                };
                let createStanding = new this.standings(standing);
                yield createStanding.save();
                createdContest.standings = createStanding._id;
                yield createdContest.save();
                let saveGroup = new this.groups(group);
                saveGroup.contests.push(createdContest._id);
                yield saveGroup.save();
                let saveUser = new this.users(user);
                saveUser.contests.push(createdContest._id);
                yield saveUser.save();
                return resolve({
                    code: 201 /* CREATED */,
                    body: {
                        result: createdContest
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
    }
    /**
     * @description return all submissions of this contest
     * @param contestID
     * @param page
     */
    getSubmissions(contestID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            const size = 15;
            let total;
            try {
                contest = yield this.contests.findById(contestID)
                    .populate({
                    path: "submissions",
                    populate: {
                        path: "user"
                    }
                })
                    .populate("owner")
                    .exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: contest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get the submissions of the contest"
                    }
                });
            }
        }));
    }
    /**
     * @description get all registrants of this contest
     * @param contestID
     * @param page
     */
    getRegistrants(contestID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            try {
                contest = yield this.contests.findById(contestID)
                    .populate("users")
                    .populate("owner")
                    .exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: contest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get the registrants of the contest"
                    }
                });
            }
        }));
    }
    /**
     * @description get standing of the contest
     * @param contestID
     */
    getStanding(contestID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let standing;
            let contest;
            try {
                contest = yield this.contests.findById(contestID).populate("problems").exec();
                standing = yield this.standings.findById(contest.standings)
                    .populate({
                    path: "trackers",
                    populate: [
                        {
                            path: "contestant"
                        }
                    ]
                })
                    .populate({
                    path: "contestID",
                    populate: [
                        {
                            path: "owner"
                        }
                    ]
                })
                    .exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: {
                            standing: standing,
                            problems: contest.problems
                        }
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get the standing of the contest"
                    }
                });
            }
        }));
    }
    /**
     * @description register a user to the contest
     * @param contestID
     * @param username
     */
    register(contestID, username) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let user;
            let tracker;
            let standing;
            try {
                contest = yield this.contestExists(contestID);
                if (!contest) {
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "CONTEST ID Not Found"
                        }
                    });
                }
                if (contest.type != InterfaceFacade_1.ContestType.INDIVIDUAL) {
                    return reject({
                        code: 406 /* NOT_ACCEPTABLE */,
                        body: {
                            name: "This is not an individual contest"
                        }
                    });
                }
                user = yield this.userExists(username);
                if (!user) {
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Username Not Found"
                        }
                    });
                }
                if (contest.endDate.getTime() < Date.now()) {
                    return reject({
                        code: 403 /* FORBIDDEN */,
                        body: {
                            name: "This contest is over"
                        }
                    });
                }
                let isRegistered = yield this.isUserAlreadyRegistered(user, contestID);
                if (isRegistered) {
                    return reject({
                        code: 409 /* CONFLICT */,
                        body: {
                            name: "User already registered to the contest"
                        }
                    });
                }
                let solved = [];
                let unSolved = [];
                for (let i = 0; i < 151; i++) {
                    solved.push(0);
                    unSolved.push(0);
                }
                standing = yield this.standings.findOne({ contestID: contest._id }).exec();
                tracker = {
                    country: user.country,
                    solvedCount: 0,
                    penalty: 0,
                    solved: solved,
                    unSolved: unSolved,
                    contestant: user._id,
                    contestants: null,
                    contestID: contest._id
                };
                let createTracker = new this.trackers(tracker);
                yield createTracker.save();
                let saveStanding = new this.standings(standing);
                saveStanding.trackers.push(createTracker._id);
                yield saveStanding.save();
                let saveContest = new this.contests(contest);
                saveContest.users.push(user._id);
                yield saveContest.save();
                let saveUser = new this.users(user);
                saveUser.contests.push(contestID);
                yield saveUser.save();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't register the user to the contest"
                    }
                });
            }
        }));
    }
    /**
     * Verify if the contest with this ID exists
     * @param contestID
     */
    contestExists(contestID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            try {
                contest = yield this.contests.findById(contestID).exec();
                return resolve(contest);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * Verify if the user with this username exists
     * @param username
     */
    userExists(username) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let user;
            try {
                user = yield this.users.findOne({ username: username }).exec();
                return resolve(user);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * Verify if the user with this id exists
     * @param id
     */
    IDExists(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let user;
            try {
                user = yield this.users.findById(id).exec();
                return resolve(user);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * Verify if the user is already registered to the contest
     * so that he(she) cannot register more than once
     * @param user
     * @param contestID
     */
    isUserAlreadyRegistered(user, contestID) {
        return new Promise((resolve) => {
            let contests = user.contests;
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
    unregister(contestID, userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let user;
            let tracker;
            let standing;
            try {
                let admin = yield this.isAdmin(contestID, userID);
                contest = yield this.contestExists(contestID);
                if (!contest) {
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "CONTEST ID Not Found"
                        }
                    });
                }
                if (contest.type != InterfaceFacade_1.ContestType.INDIVIDUAL) {
                    return reject({
                        code: 406 /* NOT_ACCEPTABLE */,
                        body: {
                            name: "This is not an individual contest"
                        }
                    });
                }
                user = yield this.IDExists(userID);
                if (!user) {
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "USER ID Not Found"
                        }
                    });
                }
                tracker = yield this.trackers.findOneAndRemove({ contestID: contestID, contestant: user._id }).exec();
                standing = yield this.standings.findOne({ contestID: contest._id }).exec();
                let saveStanding = new this.standings(standing);
                let saveUser = new this.users(user);
                let saveContest = new this.contests(contest);
                saveStanding.trackers = saveStanding.trackers.filter((track) => track != tracker._id);
                yield saveStanding.save();
                if (!admin) {
                    saveUser.contests = saveUser.contests.filter((cont) => cont != contestID);
                    yield saveUser.save();
                }
                saveContest.users = saveContest.users.filter((us) => us != userID);
                yield saveContest.save();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: saveContest
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't unregister the user from the contest"
                    }
                });
            }
        }));
    }
    /**
     * @description update the contest standing
     * @param contestID
     */
    updateStanding(contestID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let result;
            try {
                contest = yield this.contests.findById(contestID)
                    .populate("users")
                    .populate("problems")
                    .exec();
                yield this.queryProblems(contest);
                result = yield this.getStanding(contestID);
                return resolve(result);
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
    }
    /**
     * @description iterate over each problem of the contest
     * @param contest
     */
    queryProblems(contest) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < contest.problems.length; i++) {
                    console.log("PROBLEM: " + `(${i})`);
                    yield this.queryUsers(contest, contest.problems[i], i);
                }
                return resolve();
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * @description iterate over each user to see if they solved (or tried to solve) a problem
     * @param problem
     * @param contest
     */
    queryUsers(contest, problem, problemIndex) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let plateform;
            const name = problem.plateform;
            plateform = this.plateformBuilder.createPlateform(name);
            let result;
            let statusFiltered;
            try {
                console.log('INSIDE QUERY USERS');
                for (let i = 0; i < contest.users.length; i++) {
                    let user = contest.users[i];
                    result = yield plateform.updateContest(contest, user, problem);
                    statusFiltered = result.body.result;
                    yield this.querySubmissions(contest, problem, user, statusFiltered, plateform, problemIndex);
                }
                return resolve();
            }
            catch (err) {
                console.log("ERROR: ", err);
                return reject(err);
            }
        }));
    }
    /**
     * @description iterate over all user submissions during the contest and check the verdict
     * @param contest
     * @param problem
     * @param user
     * @param status
     */
    querySubmissions(contest, problem, user, status, plateform, problemIndex) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('INSIDE QUERY SUBMISSIONS');
                for (let i = 0; i < status.length; i++) {
                    yield this.getSubmission(contest, user, problem, status[i], plateform, problemIndex);
                }
                return resolve();
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * @description retrieve a specific submission from the specified platform
     * @param contest
     * @param user
     * @param problem
     * @param sub
     */
    getSubmission(contest, user, problem, sub, platform, problemIndex) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let tracker;
            try {
                let submission = yield platform.getSubmission(sub);
                if (problem.problemID == submission.problemID) {
                    let new_sub = yield this.submissions.findOne({
                        problemID: submission.problemID,
                        OJ: submission.OJ,
                        submissionID: submission.submissionID
                    }).exec();
                    if (!new_sub) {
                        submission.problemLink = problem.link;
                        submission.user = user._id;
                        tracker = yield this.trackers.findOne({
                            contestant: user._id,
                            contestID: contest._id
                        }).exec();
                        let saveTracker = new this.trackers(tracker);
                        if (saveTracker.solved[problemIndex] != 0) {
                            return resolve();
                        }
                        let createSubmission = new this.submissions(submission);
                        yield createSubmission.save();
                        let saveContest = new this.contests(contest);
                        saveContest.submissions.push(createSubmission._id);
                        yield saveContest.save();
                        let solved = saveTracker.solved[problemIndex];
                        let unSolved = saveTracker.unSolved[problemIndex];
                        let penalty = saveTracker.penalty;
                        let solvedCount = saveTracker.solvedCount;
                        if (submission.verdict != "ACCEPTED") {
                            unSolved += 1;
                        }
                        else {
                            let diff = (submission.submissionTime.getTime() - contest.startDate.getTime()) / 6000;
                            penalty += Math.round(diff);
                            solvedCount += 1;
                            solved = 1;
                        }
                        yield this.trackers.update({ _id: saveTracker._id }, { $set: {
                                [`solved.${problemIndex}`]: solved,
                                [`unSolved.${problemIndex}`]: unSolved,
                                penalty: penalty,
                                solvedCount: solvedCount
                            } });
                        return resolve();
                    }
                }
                return resolve();
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
};
IndividualContestService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Contests_1.Contests)),
    __param(1, common_1.Inject(Submissions_1.Submissions)),
    __param(2, common_1.Inject(Standings_1.Standings)),
    __param(3, common_1.Inject(Users_1.Users)),
    __param(4, common_1.Inject(Trackers_1.Trackers)),
    __param(5, common_1.Inject(Groups_1.Groups)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, PlateformBuilding_service_1.default])
], IndividualContestService);
exports.IndividualContestService = IndividualContestService;
//# sourceMappingURL=IndividualContests.service.js.map