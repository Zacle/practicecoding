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
const Users_1 = require("../../models/Users");
const InterfaceFacade_1 = require("../../interfaces/InterfaceFacade");
const PlateformBuilding_service_1 = __importDefault(require("../plateformBuilder/PlateformBuilding.service"));
const Groups_1 = require("../../models/Groups");
let ContestsService = class ContestsService {
    constructor(contests, submissions, standings, users, trackers, groups, plateformBuilder) {
        this.contests = contests;
        this.submissions = submissions;
        this.standings = standings;
        this.users = users;
        this.trackers = trackers;
        this.groups = groups;
        this.plateformBuilder = plateformBuilder;
    }
    /**
     * Verify if a contest with this name already exist
     * @param name
     */
    exists(name) {
        let result;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                result = yield this.contests.findOne({ name: name }).exec();
                if (result) {
                    return resolve(true);
                }
                return resolve(false);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * @description computes the duration of the contest
     * @param date1
     * @param date2
     */
    duration(date1, date2) {
        // Get 1 day in milliseconds
        const one_day = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();
        // Calculate the difference in milliseconds
        let difference_ms = date2_ms - date1_ms;
        // take out milliseconds
        difference_ms = difference_ms / 1000;
        let seconds = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        let minutes = Math.floor(difference_ms % 60);
        difference_ms = difference_ms / 60;
        const hours = Math.floor(difference_ms % 24);
        const days = Math.floor(difference_ms / 24);
        let duration = "";
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
                duration += hours + " hours";
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
    isValidDate(startDate, endDate) {
        return new Promise((resolve) => {
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
    shouldUpdate(startDate, endDate) {
        return new Promise((resolve, reject) => {
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
    getAllComingContests() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                try {
                    contests = yield this.contests.find({
                        startDate: {
                            "$gt": new Date()
                        },
                        access: InterfaceFacade_1.AccessType.PUBLIC
                    })
                        .populate("owner")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: contests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all public contest coming"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @returns all running public contests
     */
    getAllRunningContests() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                try {
                    contests = yield this.contests.find({
                        startDate: {
                            "$lte": new Date()
                        },
                        endDate: {
                            "$gte": new Date()
                        },
                        access: InterfaceFacade_1.AccessType.PUBLIC
                    })
                        .populate("owner")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: contests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all public contests that are running"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @returns past public contests
     */
    getPastContests(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                const size = 10;
                let total;
                try {
                    total = yield this.contests.find({
                        endDate: {
                            "$lt": new Date()
                        },
                        access: InterfaceFacade_1.AccessType.PUBLIC
                    })
                        .count()
                        .exec();
                    contests = yield this.contests.find({
                        endDate: {
                            "$lt": new Date()
                        },
                        access: InterfaceFacade_1.AccessType.PUBLIC
                    })
                        .limit(size)
                        .skip(size * (page - 1))
                        .populate("owner")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: {
                                contests: contests,
                                total: total,
                                per_page: size
                            }
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all past public contests"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param username
     * @returns all coming contests registered by the user
     */
    getComingContests(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                let comingContests = [];
                try {
                    contests = yield this.users.findOne({ username: username })
                        .populate({
                        path: "contests",
                        populate: {
                            path: "owner"
                        }
                    })
                        .exec();
                    console.log("USERS COMING CONTEST: ", contests.contests);
                    for (let i = 0; i < contests.contests.length; i++) {
                        let contest = contests.contests[i];
                        const date = new Date(contest.startDate);
                        if (date.getTime() > Date.now()) {
                            comingContests.push(contest);
                        }
                    }
                    console.log("USERS COMING CONTEST: ", comingContests);
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: comingContests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all contests attended by the user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param username
     * @returns all running contests registered by the user
     */
    getRunningContests(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                let runningContests = [];
                try {
                    contests = yield this.users.findOne({ username: username })
                        .populate({
                        path: "contests",
                        populate: {
                            path: "owner"
                        }
                    })
                        .exec();
                    console.log("USERS RUNNING CONTEST: ", contests.contests);
                    for (let i = 0; i < contests.contests.length; i++) {
                        let contest = contests.contests[i];
                        const date1 = new Date(contest.startDate);
                        const date2 = new Date(contest.endDate);
                        if (date1.getTime() < Date.now() && date2.getTime() > Date.now()) {
                            runningContests.push(contest);
                        }
                    }
                    console.log("USERS RUNNING CONTEST: ", runningContests);
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: runningContests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all contests attended by the user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param username
     * @returns all past contests attended by the user
     */
    getContests(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                let pastContests = [];
                try {
                    contests = yield this.users.findOne({ username: username })
                        .populate({
                        path: "contests",
                        populate: {
                            path: "owner"
                        }
                    })
                        .exec();
                    console.log("USERS PAST CONTEST: ", contests.contests);
                    for (let i = 0; i < contests.contests.length; i++) {
                        let contest = contests.contests[i];
                        const date = new Date(contest.endDate);
                        if (date.getTime() < Date.now()) {
                            pastContests.push(contest);
                        }
                    }
                    console.log("USERS PAST CONTEST: ", pastContests);
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: pastContests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all contests attended by the user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param contestID
     * @returns a specific contest
     */
    getContest(contestID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                try {
                    contest = yield this.contests.findById(contestID)
                        .populate("owner")
                        .exec();
                    if (!contest) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Contest ID not found"
                            }
                        });
                    }
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
                            name: "Couldn't get the contest"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Update contest
     * @param Icontest
     * @param contestID
     * @param access
     */
    updateContest(Icontest, contestID, access) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                let startDate = new Date(Icontest.startDateYear, Icontest.startDateMonth - 1, Icontest.startDateDay, Icontest.startTimeHour, Icontest.startTimeMinute);
                let endDate = new Date(Icontest.endDateYear, Icontest.endDateMonth - 1, Icontest.endDateDay, Icontest.endTimeHour, Icontest.endTimeMinute);
                try {
                    const admin = yield this.isAdmin(contestID, Icontest.owner);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to update this contest"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let isValid = yield this.isValidStartDate(startDate);
                    if (isValid) {
                        contest.startDate = startDate;
                    }
                    else {
                        startDate = contest.startDate;
                    }
                    isValid = yield this.isValidEndDate(startDate, endDate);
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
                            name: "Couldn't update the contest"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @description verify if the start date can be updated
     * @param date
     */
    isValidStartDate(date) {
        return new Promise((resolve) => {
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
    isValidEndDate(startDate, endDate) {
        return new Promise((resolve) => {
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
    isAdmin(contestID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                try {
                    contest = yield this.contests.findById(contestID, "-__v").exec();
                    if (contest) {
                        if (contest.owner.toString() == userID.toString())
                            return resolve(true);
                        return resolve(false);
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
     * @description delete a contest
     * @param contestID
     * @param userID
     */
    deleteContest(contestID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                try {
                    const admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to delete this contest"
                            }
                        });
                    }
                    contest = yield this.contests.findByIdAndRemove(contestID).exec();
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
                            name: "Couldn't delete the contest"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @description return the type of the contest (INDIVIDUAL OR TEAM)
     * @param contestID
     */
    getContestType(contestID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            try {
                contest = yield this.contests.findById(contestID).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: contest.type
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get the contest type"
                    }
                });
            }
        }));
    }
    /**
     * @description get all problems of this contest
     * @param contestID
     */
    getProblems(contestID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                try {
                    contest = yield this.contests.findById(contestID)
                        .populate("problems")
                        .populate("owner")
                        .exec();
                    if (!contest) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Contest ID Not Found"
                            }
                        });
                    }
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
                            name: "Couldn't get all problems of this contest"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @description add a specific problem to the contest
     * @param contestID
     * @param problemID
     * @param userID
     */
    addSpecificProblem(contestID, problem, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let plateform;
                let result;
                let contest;
                try {
                    let admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to add problems"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let contestOver = yield this.isContestOver(contest);
                    if (contestOver) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "Contest is over"
                            }
                        });
                    }
                    let exists = yield this.problemExists(contest, problem);
                    if (exists) {
                        return reject({
                            code: 409 /* CONFLICT */,
                            body: {
                                name: "Problem already exist"
                            }
                        });
                    }
                    plateform = this.plateformBuilder.createPlateform(problem.plateform);
                    result = yield plateform.addSpecificProblem(contestID, problem);
                    return resolve(result);
                }
                catch (err) {
                    result = err;
                    return reject(result);
                }
            }));
        });
    }
    /**
     * verify if this problem already exists before adding it
     * @param contest
     * @param problem
     */
    problemExists(contest, problem) {
        return new Promise((resolve, reject) => {
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
    isContestOver(contest) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (contest.endDate.getTime() < Date.now()) {
                    resolve(true);
                }
                resolve(false);
            }
            catch (err) {
                resolve(true);
            }
        }));
    }
    /**
     * @description add problems from a codeforces contest
     * @param contestID
     * @param codeforceID
     * @param userID
     */
    addProblemsFromCodeforces(contestID, codeforceID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let plateform;
                let contest;
                try {
                    let admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to add problems"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let contestOver = yield this.isContestOver(contest);
                    if (contestOver) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "Contest is over"
                            }
                        });
                    }
                    plateform = this.plateformBuilder.createPlateform("Codeforces");
                    result = yield plateform.addProblemsFromCodeforces(contestID, codeforceID);
                    return resolve(result);
                }
                catch (err) {
                    result = err;
                    return reject(result);
                }
            }));
        });
    }
    /**
     * @description add problems from past uva contest
     * @param contestID
     * @param problems
     * @param userID
     */
    addProblemsFromUVA(contestID, problems, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let plateform;
                let contest;
                try {
                    let admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to add problems"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let contestOver = yield this.isContestOver(contest);
                    if (contestOver) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "Contest is over"
                            }
                        });
                    }
                    plateform = this.plateformBuilder.createPlateform("Uva");
                    result = yield plateform.addProblemsFromUVA(contestID, problems);
                    return resolve(result);
                }
                catch (err) {
                    result = err;
                    return reject(result);
                }
            }));
        });
    }
    /**
     * @description add problems from an existing public contest
     * @param contestID
     * @param existingID
     * @param userID
     */
    addProblemsFromExisting(contestID, existingID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                let existing;
                try {
                    let admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to add problems"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let contestOver = yield this.isContestOver(contest);
                    if (contestOver) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "Contest is over"
                            }
                        });
                    }
                    let saveContest = new this.contests(contest);
                    existing = yield this.contests.findById(existingID).exec();
                    saveContest.problems.push(...existing.problems);
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
                            name: "Couldn't add problems from an existing contest to this contest"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID
     * @param quantity
     * @param userID
     * @param plateformName
     */
    addRandomProblems(contestID, quantity, userID, plateformName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let plateform;
                let contest;
                try {
                    let admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to add problems"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let contestOver = yield this.isContestOver(contest);
                    if (contestOver) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "Contest is over"
                            }
                        });
                    }
                    plateform = this.plateformBuilder.createPlateform(plateformName);
                    result = yield plateform.addRandomProblems(contestID, quantity);
                    return resolve(result);
                }
                catch (err) {
                    result = err;
                    return reject(result);
                }
            }));
        });
    }
    /**
     * @description remove a problem from the contest
     * @param contestID
     * @param problemID
     * @param userID
     */
    removeProblem(contestID, problemID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                try {
                    let admin = yield this.isAdmin(contestID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to add problems"
                            }
                        });
                    }
                    contest = yield this.contests.findById(contestID).exec();
                    let contestOver = yield this.isContestOver(contest);
                    if (contestOver) {
                        return reject({
                            code: 406 /* NOT_ACCEPTABLE */,
                            body: {
                                name: "Contest is over"
                            }
                        });
                    }
                    let saveContest = new this.contests(contest);
                    saveContest.problems = saveContest.problems.filter((id) => id != problemID);
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
                            name: "Couldn't remove this problem"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @description add a submission from user
     * @param contestID
     * @param submissionID
     */
    addSubmission(contestID, submissionID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                try {
                    contest = yield this.contests.findById(contestID).exec();
                    let saveContest = new this.contests(contest);
                    saveContest.submissions.push(submissionID);
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
                            name: "Couldn't add this sumbmission to the contest"
                        }
                    });
                }
            }));
        });
    }
};
ContestsService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Contests_1.Contests)),
    __param(1, common_1.Inject(Submissions_1.Submissions)),
    __param(2, common_1.Inject(Standings_1.Standings)),
    __param(3, common_1.Inject(Users_1.Users)),
    __param(4, common_1.Inject(Trackers_1.Trackers)),
    __param(5, common_1.Inject(Groups_1.Groups)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, PlateformBuilding_service_1.default])
], ContestsService);
exports.ContestsService = ContestsService;
//# sourceMappingURL=Contests.service.js.map