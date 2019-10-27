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
const Util_1 = __importDefault(require("../../Util"));
const Problems_1 = require("../../models/Problems");
const Contests_1 = require("../../models/contests/Contests");
const Users_1 = require("../../models/Users");
const axios_1 = __importDefault(require("axios"));
/*
 *  Define the plateform superclass that will serve as a base
 *  class for all plateform
*/
let Plateform = class Plateform {
    constructor(problems, contests, users) {
        this.problems = problems;
        this.contests = contests;
        this.users = users;
        Util_1.default.trace("Plateform::init() Updated");
    }
    /**
     * @description add problems from a codeforces contest
     * @param contestID
     * @param codeforceID
     */
    addProblemsFromCodeforces(contestID, codeforceID) {
        return Promise.reject({
            code: 400 /* BAD_REQUEST */,
            body: {
                name: "Bad Request"
            }
        });
    }
    /**
     * @description add problems from past uva contest
     * @param contestID
     * @param problems
     */
    addProblemsFromUVA(contestID, problems) {
        return Promise.reject({
            code: 400 /* BAD_REQUEST */,
            body: {
                name: "Bad Request"
            }
        });
    }
    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID
     * @param quantity
     * @param plateform
     */
    randomProblems(contestID, quantity, plateform) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                let problems;
                const EASY = Math.ceil(quantity * (40 / 100));
                const MEDIUM = Math.floor(quantity * (40 / 100));
                const HARD = Math.ceil(quantity * (20 / 100));
                try {
                    contest = yield this.contests.findById(contestID).exec();
                    let saveContest = new this.contests(contest);
                    if (EASY > 0) {
                        problems = yield this.problems.aggregate([
                            { $sample: { size: EASY } },
                            { $match: {
                                    "plateform": plateform,
                                    "difficulty": "easy"
                                } }
                        ]).exec();
                        problems.forEach((pr) => {
                            saveContest.problems.push(pr._id);
                        });
                    }
                    if (MEDIUM > 0) {
                        problems = yield this.problems.aggregate([
                            { $sample: { size: MEDIUM } },
                            { $match: {
                                    "plateform": plateform,
                                    "difficulty": "medium"
                                } }
                        ]).exec();
                        problems.forEach((pr) => {
                            saveContest.problems.push(pr._id);
                        });
                    }
                    if (HARD > 0) {
                        problems = yield this.problems.aggregate([
                            { $sample: { size: HARD } },
                            { $match: {
                                    "plateform": plateform,
                                    "difficulty": "hard"
                                } }
                        ]).exec();
                        problems.forEach((pr) => {
                            saveContest.problems.push(pr._id);
                        });
                    }
                    yield saveContest.save();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: saveContest
                        }
                    });
                }
                catch (err) {
                    console.log("ERRORR: ", err);
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: `Couldn't add random problems from ${plateform} to this contest`
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return submission object based on platform
     * @param submission
     */
    getSubmission(submission) {
        return null;
    }
};
Plateform = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Problems_1.Problems)),
    __param(1, common_1.Inject(Contests_1.Contests)),
    __param(2, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object, Object, Object])
], Plateform);
exports.Plateform = Plateform;
let Codeforces = class Codeforces extends Plateform {
    constructor(problemsModel, contestsModel, usersModel) {
        super(problemsModel, contestsModel, usersModel);
        this.problemsModel = problemsModel;
        this.contestsModel = contestsModel;
        this.usersModel = usersModel;
        Util_1.default.trace("Codeforces::init() Updated");
    }
    /**
     * Return all Codeforces problems matching the given key
     * @param key
     * @return {Promise<InsightResponse>}
     */
    getProblems(key) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problems = [];
            try {
                problems = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "name": {
                        "$regex": key,
                        "$options": "i"
                    }
                }).limit(10).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: problems
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Can't get problems from Codeforces"
                    }
                });
            }
        }));
    }
    /**
     * Get all problems from Codeforces website using their api
     * @returns {Promise<InsightResponse>}
     */
    getListOfProblems() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const path = "https://codeforces.com/api/problemset.problems";
                let res = [];
                this.problemsModel.deleteMany({}).exec();
                try {
                    let status = yield this.readAPI(path);
                    if (status.status == "FAILED") {
                        return reject({
                            code: 400 /* BAD_REQUEST */,
                            body: {
                                name: "Can't get problems from Codeforces"
                            }
                        });
                    }
                    let promise = status.result;
                    promise.problems.forEach((problem) => __awaiter(this, void 0, void 0, function* () {
                        let diff;
                        if (problem.rating) {
                            if (problem.rating <= 1300)
                                diff = "easy";
                            else if (problem.rating <= 2000)
                                diff = "medium";
                            else
                                diff = "hard";
                        }
                        else {
                            diff = "medium";
                        }
                        let result = {
                            "problemID": problem.contestId + "" + problem.index,
                            "contestID": problem.contestId,
                            "name": problem.index + ". " + problem.name,
                            "plateform": this.getPlateform(),
                            "link": `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
                            "difficulty": diff
                        };
                        console.log(result);
                        res.push(result);
                    }));
                    console.log("OUTSIDE");
                    console.log("SiZEEEE: ", res.length);
                    yield this.problemsModel.create(res);
                    console.log("RESULTTTTT: ", res.length);
                    return resolve({
                        code: 201 /* CREATED */,
                        body: {
                            result: res
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Can't get problems from Codeforces"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param link The link of the API to get all problems.
     */
    readAPI(link) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("CALLLLING Codeforces READ API WITH AXIOS");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let res = {};
                yield axios_1.default.get(link)
                    .then((result) => {
                    res = result.data;
                    return resolve(res);
                })
                    .catch((err) => {
                    console.log("ERROR MESSAGE: ", err.response.data);
                    if (err.response.data.status == "FAILED") {
                        return resolve(err.response.data);
                    }
                    else {
                        return reject(err);
                    }
                });
            }));
        });
    }
    /**
     * Return Codeforces problems of the given difficulty
     * @param level
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level, page) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let total;
            let problems = [];
            const size = 10;
            try {
                total = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "difficulty": level
                }).count().exec();
                problems = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "difficulty": level
                })
                    .limit(size)
                    .skip(size * (page - 1))
                    .exec();
                console.log("RESULTTTTT: ", problems.length);
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: {
                            problems: problems,
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
                        name: "Can't get problems from Codeforces"
                    }
                });
            }
        }));
    }
    /**
     * @description add a specific problem to the contest
     * @param contestID
     * @param problem
     */
    addSpecificProblem(contestID, problem) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let problems;
            try {
                contest = yield this.contestsModel.findById(contestID).exec();
                problems = yield this.problemsModel.findOne({ problemID: problem.problemID, plateform: this.getPlateform() }).exec();
                if (!problems) {
                    return reject({
                        code: 304 /* NOT_MODIFIED */,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }
                let saveContest = new this.contestsModel(contest);
                saveContest.problems.push(problems._id);
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
                        name: "Couldn't add problem to this contest"
                    }
                });
            }
        }));
    }
    /**
     * @description add problems from a codeforces contest
     * @param contestID
     * @param codeforceID
     */
    addProblemsFromCodeforces(contestID, codeforceID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let codeforces;
            try {
                contest = yield this.contestsModel.findById(contestID).exec();
                codeforces = yield this.problemsModel.find({ contestID: codeforceID, plateform: this.getPlateform() }).exec();
                if (codeforces.length == 0) {
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Sorry!. This contest is not yet added on Practice Coding OJ"
                        }
                    });
                }
                let saveContest = new this.contestsModel(contest);
                codeforces.forEach((problem) => {
                    saveContest.problems.push(problem._id);
                });
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
                        name: "Couldn't add problems from Codeforces contest to this contest"
                    }
                });
            }
        }));
    }
    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID
     * @param quantity
     */
    addRandomProblems(contestID, quantity) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        }));
    }
    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest, user) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const handle = user.codeforces;
            const link = "https://codeforces.com/api/user.status?handle=" + handle;
            let result;
            let status;
            let statusFiltered = [];
            let startSecond = contest.startDate.getTime() / 1000;
            let endSecond = contest.endDate.getTime() / 1000;
            try {
                result = yield this.readAPI(link);
                if (result.status == "FAILED") {
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: []
                        }
                    });
                }
                status = result.result;
                for (let i = 0; i < status.length; i++) {
                    let submission = status[i];
                    if (submission.creationTimeSeconds >= startSecond && submission.creationTimeSeconds < endSecond && submission.verdict != "TESTING") {
                        statusFiltered.push(submission);
                    }
                    if (submission.creationTimeSeconds < startSecond) {
                        break;
                    }
                }
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: statusFiltered
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
     * Return submission object based on platform
     * @param submission
     */
    getSubmission(submission) {
        return new Promise((resolve) => {
            let sub = {
                submissionID: submission.id,
                verdict: this.getVerdict(submission.verdict),
                language: submission.programmingLanguage,
                submissionTime: new Date(submission.creationTimeSeconds * 1000),
                problemName: submission.problem.index + ". " + submission.problem.name,
                OJ: this.getPlateform(),
                problemID: submission.problem.contestId + "" + submission.problem.index,
                problemLink: "",
                user: null,
                team: null
            };
            resolve(sub);
        });
    }
    getVerdict(verdict) {
        if (verdict == "OK")
            return "ACCEPTED";
        return verdict;
    }
    getPlateform() {
        return "Codeforces";
    }
};
Codeforces = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Problems_1.Problems)),
    __param(1, common_1.Inject(Contests_1.Contests)),
    __param(2, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object, Object, Object])
], Codeforces);
exports.Codeforces = Codeforces;
let Uva = class Uva extends Plateform {
    constructor(problemsModel, contestsModel, usersModel) {
        super(problemsModel, contestsModel, usersModel);
        this.problemsModel = problemsModel;
        this.contestsModel = contestsModel;
        this.usersModel = usersModel;
        Util_1.default.trace("Uva::init()");
    }
    /**
     * Return all Uva problems matching the given key
     * @param key
     * @return {Promise<InsightResponse>}
     */
    getProblems(key) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problems = [];
            try {
                problems = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "name": {
                        "$regex": key,
                        "$options": "i"
                    }
                }).limit(10).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: problems
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Can't get problems from Uva"
                    }
                });
            }
        }));
    }
    getDifficulty(accepted, total) {
        let diff;
        if (total === 0) {
            diff = "medium";
        }
        else {
            let solvedPercentage = (accepted / total) * 100;
            if (solvedPercentage >= 70) {
                diff = "easy";
            }
            else if (solvedPercentage >= 35) {
                diff = "medium";
            }
            else {
                diff = "hard";
            }
        }
        return diff;
    }
    parseProblem(problem, diff) {
        let result = {
            "problemID": problem[0],
            "contestID": problem[1],
            "name": problem[1] + " - " + problem[2],
            "plateform": this.getPlateform(),
            "link": `https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=${problem[0]}`,
            "difficulty": diff
        };
        return result;
    }
    /**
     * Get all problems from Uva website using uhunt api
     * @returns {Promise<InsightResponse>}
     */
    getListOfProblems() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const path = "https://uhunt.onlinejudge.org/api/p";
                let res = [];
                let ans = [];
                try {
                    let problem = yield this.readAPI(path);
                    for (let i = 0; i < problem.length; i += 1) {
                        let diff;
                        let accepted = problem[i][18];
                        let wrong = problem[i][16];
                        let total = (accepted + wrong);
                        diff = this.getDifficulty(accepted, total);
                        let result = this.parseProblem(problem[i], diff);
                        console.log(result);
                        res.push(result);
                    }
                    yield this.problemsModel.create(res);
                    return resolve({
                        code: 201 /* CREATED */,
                        body: {
                            result: res
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Can't get problems from Uva"
                        }
                    });
                }
            }));
        });
    }
    readAPI(link) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("CALLLLING UVA READ API");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let res;
                yield axios_1.default.get(link)
                    .then((result) => {
                    console.log("BEFOOORE: ", result.data);
                    res = result.data;
                    return resolve(res);
                })
                    .catch((err) => {
                    return reject(err);
                });
            }));
        });
    }
    /**
     * Return Uva problems of the given difficulty
     * @param level
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level, page) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let total;
            let problems = [];
            const size = 10;
            try {
                total = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "difficulty": level
                }).count().exec();
                problems = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "difficulty": level
                })
                    .limit(size)
                    .skip(size * (page - 1))
                    .exec();
                console.log("RESULTTTTT: ", problems.length);
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: {
                            problems: problems,
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
                        name: "Can't get problems from Uva"
                    }
                });
            }
        }));
    }
    /**
     * @description add a specific problem to the contest
     * @param contestID
     * @param problem
     * @param userID
     */
    addSpecificProblem(contestID, problem) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let problems;
            try {
                contest = yield this.contestsModel.findById(contestID).exec();
                problems = yield this.problemsModel.findOne({ problemID: problem.problemID, plateform: this.getPlateform() }).exec();
                if (!problems) {
                    return reject({
                        code: 304 /* NOT_MODIFIED */,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }
                let saveContest = new this.contestsModel(contest);
                saveContest.problems.push(problems._id);
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
                        name: "Couldn't add problem to this contest"
                    }
                });
            }
        }));
    }
    /**
     * @description add problems from past uva contest
     * @param contestID
     * @param problems
     */
    addProblemsFromUVA(contestID, problems) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contest;
                let problem;
                try {
                    contest = yield this.contestsModel.findById(contestID).exec();
                    let saveContest = new this.contestsModel(contest);
                    for (let i = 0; i < problems.length; i++) {
                        yield this.saveUvaProblems(saveContest, problems[i]);
                    }
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
                            name: "Couldn't add problems from Uva contest to this contest"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @description asynchronous function used to save problems within a loop
     * @param contest
     * @param id
     */
    saveUvaProblems(contest, id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problem;
            try {
                problem = yield this.problemsModel.findOne({ contestID: id, plateform: this.getPlateform() }).exec();
                contest.problems.push(problem._id);
                yield contest.save();
                return resolve(contest);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID
     * @param quantity
     */
    addRandomProblems(contestID, quantity) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        }));
    }
    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest, user, problem) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const handle = user.uva;
            let converToId = "https://uhunt.onlinejudge.org/api/uname2uid/" + handle;
            const link = "https://uhunt.onlinejudge.org/api/subs-pids/";
            let status;
            let statusFiltered;
            let startSecond = new Date(contest.startDate).getTime() / 1000;
            let endSecond = new Date(contest.endDate).getTime() / 1000;
            try {
                let converted = yield this.readAPI(converToId);
                if (converted == 0) {
                    return resolve({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            result: []
                        }
                    });
                }
                status = yield this.readAPI(link + converted + "/" + problem.problemID);
                const convertedToString = "" + converted;
                if (!status) {
                    return resolve({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            result: []
                        }
                    });
                }
                statusFiltered = status[convertedToString].subs;
                statusFiltered = statusFiltered.filter((submission) => {
                    console.log("SUBMISSION: " + submission[4] + " " + startSecond + " " + endSecond);
                    return (new Date(submission[4]).getTime()) >= startSecond && (new Date(submission[4]).getTime()) < endSecond && submission[2] != 20;
                });
                console.log("FILTERED: ", statusFiltered);
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: statusFiltered
                    }
                });
            }
            catch (err) {
                return resolve({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        result: []
                    }
                });
            }
        }));
    }
    /**
     * Return submission object based on platform
     * @param submission
     */
    getSubmission(submission) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problem;
            try {
                problem = yield this.problemsModel.findOne({ problemID: submission[1], plateform: this.getPlateform() }).exec();
                let sub = {
                    submissionID: submission[0],
                    problemID: submission[1],
                    verdict: this.getVerdict(submission[2]),
                    submissionTime: new Date(submission[4] * 1000),
                    OJ: this.getPlateform(),
                    problemName: problem.name,
                    problemLink: problem.link,
                    language: this.getLanguage(submission[5]),
                    user: null,
                    team: null
                };
                return resolve(sub);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * @description convert to a readable language
     * @param language
     */
    getLanguage(language) {
        switch (language) {
            case 1:
                return "AINSI C";
            case 2:
                return "Java";
            case 3:
                return "C++";
            case 4:
                return "Pascal";
            case 5:
                return "C++11";
        }
    }
    /**
     * @description return the verdict
     * @param verdict
     */
    getVerdict(verdict) {
        switch (verdict) {
            case 10:
                return "FAILED";
            case 15:
                return "FAILED";
            case 20:
                return "IN_QUEUE";
            case 30:
                return "COMPILATION_ERROR";
            case 35:
                return "RESTRICTED_FUNCTION";
            case 40:
                return "RUNTIME_ERROR";
            case 45:
                return "OUTPUT_ERROR";
            case 50:
                return "TIME_LIMIT_EXCEEDED";
            case 60:
                return "MEMORY_LIMIT_EXCEEDED";
            case 70:
                return "WRONG_ANSWER";
            case 80:
                return "PRESENTATION_ERROR";
            case 90:
                return "ACCEPTED";
            default:
                return "FAILED";
        }
    }
    getPlateform() {
        return "Uva";
    }
};
Uva = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Problems_1.Problems)),
    __param(1, common_1.Inject(Contests_1.Contests)),
    __param(2, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object, Object, Object])
], Uva);
exports.Uva = Uva;
let LiveArchive = class LiveArchive extends Plateform {
    constructor(problemsModel, contestsModel, usersModel) {
        super(problemsModel, contestsModel, usersModel);
        this.problemsModel = problemsModel;
        this.contestsModel = contestsModel;
        this.usersModel = usersModel;
        Util_1.default.trace("LiveArchive::init()");
    }
    /**
     * Return all Live Archive problems matching the given key
     * @param key
     * @return {Promise<InsightResponse>}
     */
    getProblems(key) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problems = [];
            try {
                problems = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "name": {
                        "$regex": key,
                        "$options": "i"
                    }
                }).limit(10).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: problems
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Can't get problems from Live Archive"
                    }
                });
            }
        }));
    }
    getDifficulty(accepted, total) {
        let diff;
        if (total === 0) {
            diff = "medium";
        }
        else {
            let solvedPercentage = (accepted / total) * 100;
            if (solvedPercentage >= 70) {
                diff = "easy";
            }
            else if (solvedPercentage >= 35) {
                diff = "medium";
            }
            else {
                diff = "hard";
            }
        }
        return diff;
    }
    parseProblem(problem, diff) {
        let result = {
            "problemID": problem[0],
            "contestID": problem[1],
            "name": problem[1] + " - " + problem[2],
            "plateform": this.getPlateform(),
            "link": `https://icpcarchive.ecs.baylor.edu/index.php?option=onlinejudge&page=show_problem&problem=${problem[0]}`,
            "difficulty": diff
        };
        return result;
    }
    /**
     * Get all problems from Live Archive website using uhunt api
     * @returns {Promise<InsightResponse>}
     */
    getListOfProblems() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const path = "https://icpcarchive.ecs.baylor.edu/uhunt/api/p";
                let res = [];
                try {
                    let problem = yield this.readAPI(path);
                    for (let i = 0; i < problem.length; i += 1) {
                        let diff;
                        let accepted = problem[i][18];
                        let wrong = problem[i][16];
                        let total = (accepted + wrong);
                        diff = this.getDifficulty(accepted, total);
                        let result = this.parseProblem(problem[i], diff);
                        console.log(result);
                        res.push(result);
                    }
                    yield this.problemsModel.create(res);
                    console.log("RESULTTTTT: ", res.length);
                    return resolve({
                        code: 201 /* CREATED */,
                        body: {
                            result: res
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
    readAPI(link) {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("CALLLLING LA READ API");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let res;
                yield axios_1.default.get(link)
                    .then((result) => {
                    console.log("BEFOOORE: ", result.data);
                    res = result.data;
                    return resolve(res);
                })
                    .catch((err) => {
                    return reject(err);
                });
            }));
        });
    }
    /**
     * Return Live Archive problems of the given difficulty
     * @param level
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level, page) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let total;
            let problems = [];
            const size = 10;
            try {
                total = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "difficulty": level
                }).count().exec();
                problems = yield this.problemsModel.find({
                    "plateform": this.getPlateform(),
                    "difficulty": level
                })
                    .limit(size)
                    .skip(size * (page - 1))
                    .exec();
                console.log("RESULTTTTT: ", problems.length);
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: {
                            problems: problems,
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
                        name: "Can't get problems from Live Archive"
                    }
                });
            }
        }));
    }
    /**
     * @description add a specific problem to the contest
     * @param contestID
     * @param problem
     */
    addSpecificProblem(contestID, problem) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let problems;
            try {
                contest = yield this.contestsModel.findById(contestID).exec();
                problems = yield this.problemsModel.findOne({ problemID: problem.problemID, plateform: this.getPlateform() }).exec();
                if (!problem) {
                    return reject({
                        code: 304 /* NOT_MODIFIED */,
                        body: {
                            name: "Problem ID Not Found"
                        }
                    });
                }
                let saveContest = new this.contestsModel(contest);
                saveContest.problems.push(problems._id);
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
                        name: "Couldn't add problem to this contest"
                    }
                });
            }
        }));
    }
    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID
     * @param quantity
     */
    addRandomProblems(contestID, quantity) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield this.randomProblems(contestID, quantity, this.getPlateform());
                return resolve(response);
            }
            catch (err) {
                response = err;
                return reject(response);
            }
        }));
    }
    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest, user, problem) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const handle = user.livearchive;
            let converToId = "https://icpcarchive.ecs.baylor.edu/uhunt/api/uname2uid/" + handle;
            const link = "https://icpcarchive.ecs.baylor.edu/uhunt/api/subs-pids/";
            let status;
            let statusFiltered;
            let startSecond = new Date(contest.startDate).getTime() / 1000;
            let endSecond = new Date(contest.endDate).getTime() / 1000;
            try {
                let converted = yield this.readAPI(converToId);
                if (converted == 0) {
                    return resolve({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            result: []
                        }
                    });
                }
                status = yield this.readAPI(link + converted + "/" + problem.problemID);
                const convertedToString = "" + converted;
                if (!status) {
                    return resolve({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            result: []
                        }
                    });
                }
                statusFiltered = status[convertedToString].subs;
                statusFiltered = statusFiltered.filter((submission) => {
                    let offset = 7.30;
                    let date = new Date((submission[4] * 1000) + (3600000 * offset));
                    console.log("SUBMISSION: " + date + " " + " " + date.getTime() + " " + startSecond + " " + endSecond);
                    return (date.getTime() / 1000) >= startSecond && (date.getTime() / 1000) < endSecond && submission[2] != 20;
                });
                console.log("FILTERED: ", statusFiltered);
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: statusFiltered
                    }
                });
            }
            catch (err) {
                return resolve({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        result: []
                    }
                });
            }
        }));
    }
    /**
     * Return submission object based on platform
     * @param submission
     */
    getSubmission(submission) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problem;
            try {
                problem = yield this.problemsModel.findOne({ problemID: submission[1], plateform: this.getPlateform() }).exec();
                let offset = 7.30;
                let date = new Date((submission[4] * 1000) + (3600000 * offset));
                let sub = {
                    submissionID: submission[0],
                    problemID: submission[1],
                    verdict: this.getVerdict(submission[2]),
                    submissionTime: date,
                    OJ: this.getPlateform(),
                    problemName: problem.name,
                    problemLink: problem.link,
                    language: this.getLanguage(submission[5]),
                    user: null,
                    team: null
                };
                return resolve(sub);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    /**
     * @description convert to a readable language
     * @param language
     */
    getLanguage(language) {
        switch (language) {
            case 1:
                return "AINSI C";
            case 2:
                return "Java";
            case 3:
                return "C++";
            case 4:
                return "Pascal";
            case 5:
                return "C++11";
        }
    }
    /**
     * @description return the verdict
     * @param verdict
     */
    getVerdict(verdict) {
        switch (verdict) {
            case 10:
                return "FAILED";
            case 15:
                return "FAILED";
            case 20:
                return "IN_QUEUE";
            case 30:
                return "COMPILATION_ERROR";
            case 35:
                return "RESTRICTED_FUNCTION";
            case 40:
                return "RUNTIME_ERROR";
            case 45:
                return "OUTPUT_ERROR";
            case 50:
                return "TIME_LIMIT_EXCEEDED";
            case 60:
                return "MEMORY_LIMIT_EXCEEDED";
            case 70:
                return "WRONG_ANSWER";
            case 80:
                return "PRESENTATION_ERROR";
            case 90:
                return "ACCEPTED";
            default:
                return "FAILED";
        }
    }
    getPlateform() {
        return "Live Archive";
    }
};
LiveArchive = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Problems_1.Problems)),
    __param(1, common_1.Inject(Contests_1.Contests)),
    __param(2, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LiveArchive);
exports.LiveArchive = LiveArchive;
/*
 *  If the user didn't specify any palteform in the query
 *  use all plateforms at the same time to search for a problem
 *  matching the query
*/
let AllPlateforms = class AllPlateforms extends Plateform {
    constructor(problemsModel, contestsModel, usersModel, codeforces, livearchive, uva) {
        super(problemsModel, contestsModel, usersModel);
        this.problemsModel = problemsModel;
        this.contestsModel = contestsModel;
        this.usersModel = usersModel;
        this.codeforces = codeforces;
        this.livearchive = livearchive;
        this.uva = uva;
        Util_1.default.trace("AllPlateforms::init()");
    }
    /**
     * Return all problems matching the given key
     * @param key
     * @return {Promise<InsightResponse>}
     */
    getProblems(key) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let codeforcesProblems;
            let uvaProblems;
            let livearchiveProblems;
            let res = [];
            try {
                codeforcesProblems = yield this.codeforces.getProblems(key);
                livearchiveProblems = yield this.livearchive.getProblems(key);
                uvaProblems = yield this.uva.getProblems(key);
                res = res.concat(codeforcesProblems.body.result);
                res = res.concat(livearchiveProblems.body.result);
                res = res.concat(uvaProblems.body.result);
                console.log("ADDED UVA RESULTTTTT: ", res.length);
                res = this.shuflle(res);
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: res
                    }
                });
            }
            catch (err) {
                console.log("ERRRRRORRR: ", err);
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Can't get problems"
                    }
                });
            }
        }));
    }
    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    shuflle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    /**
     * Get all problems from Codeforces, Uva and Live Archive websites using uhunt api
     * @returns {Promise<InsightResponse>}
     */
    getListOfProblems() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let codeforcesProblems;
                let uvaProblems;
                let livearchiveProblems;
                let res;
                try {
                    codeforcesProblems = yield this.codeforces.getListOfProblems();
                    uvaProblems = yield this.uva.getListOfProblems();
                    livearchiveProblems = yield this.livearchive.getListOfProblems();
                    return resolve(livearchiveProblems);
                }
                catch (err) {
                    console.log("ERRRRRORRR: ", err);
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Can't get problems"
                        }
                    });
                }
            }));
        });
    }
    readAPI(link) {
        throw new Error("Method not implemented.");
    }
    /**
     * Return all problems of the given difficulty
     * @param level
     * @returns {Promise<InsightResponse>}
     */
    getProblemsFiltered(level, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let codeforcesProblems;
                let uvaProblems;
                let livearchiveProblems;
                let res = [];
                const size = 30;
                let total = 0;
                try {
                    codeforcesProblems = yield this.codeforces.getProblemsFiltered(level, page);
                    uvaProblems = yield this.uva.getProblemsFiltered(level, page);
                    livearchiveProblems = yield this.livearchive.getProblemsFiltered(level, page);
                    res = res.concat(codeforcesProblems.body.result.problems);
                    res = res.concat(livearchiveProblems.body.result.problems);
                    res = res.concat(uvaProblems.body.result.problems);
                    res = this.shuflle(res);
                    total = codeforcesProblems.body.result.total + uvaProblems.body.result.total + livearchiveProblems.body.result.total;
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: {
                                problems: res,
                                total: total,
                                per_page: size
                            }
                        }
                    });
                }
                catch (err) {
                    console.log("ERRRRRORRR: ", err);
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Can't get problems"
                        }
                    });
                }
            }));
        });
    }
    getAllProblems() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let problems;
            try {
                problems = yield this.problemsModel.find({}).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: problems
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: `Couldn't  get all problems`
                    }
                });
            }
        }));
    }
    addSpecificProblem(contestID, problem) {
        throw new Error("Method not implemented.");
    }
    /**
     * @description add randoms problems to the contest with varying difficulties(EASY, MEDIUM, HARD)
     * @param contestID
     * @param quantity
     */
    addRandomProblems(contestID, quantity) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let contest;
            let problems;
            const EASY = Math.ceil(quantity * (40 / 100));
            const MEDIUM = Math.floor(quantity * (40 / 100));
            const HARD = Math.ceil(quantity * (20 / 100));
            try {
                contest = yield this.contestsModel.findById(contestID).exec();
                let saveContest = new this.contestsModel(contest);
                if (EASY > 0) {
                    problems = yield this.problemsModel.aggregate([
                        { $sample: { size: EASY } },
                        { $match: {
                                "difficulty": "easy"
                            } }
                    ]).exec();
                    problems.forEach((pr) => {
                        saveContest.problems.push(pr._id);
                    });
                }
                if (MEDIUM > 0) {
                    problems = yield this.problemsModel.aggregate([
                        { $sample: { size: MEDIUM } },
                        { $match: {
                                "difficulty": "medium"
                            } }
                    ]).exec();
                    problems.forEach((pr) => {
                        saveContest.problems.push(pr._id);
                    });
                }
                if (HARD > 0) {
                    problems = yield this.problemsModel.aggregate([
                        { $sample: { size: HARD } },
                        { $match: {
                                "difficulty": "hard"
                            } }
                    ]).exec();
                    problems.forEach((pr) => {
                        saveContest.problems.push(pr._id);
                    });
                }
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
                        name: `Couldn't add random problems to this contest`
                    }
                });
            }
        }));
    }
    /**
     * @description update the contest standing
     * @param contest
     * @param user
     * @param problem
     */
    updateContest(contest, user) {
        throw new Error("Method not implemented.");
    }
    getPlateform() {
        return null;
    }
};
AllPlateforms = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Problems_1.Problems)),
    __param(1, common_1.Inject(Contests_1.Contests)),
    __param(2, common_1.Inject(Users_1.Users)),
    __metadata("design:paramtypes", [Object, Object, Object, Codeforces,
        LiveArchive,
        Uva])
], AllPlateforms);
exports.AllPlateforms = AllPlateforms;
//# sourceMappingURL=Plateform.service.js.map