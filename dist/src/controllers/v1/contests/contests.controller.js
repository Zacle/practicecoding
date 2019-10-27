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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Express = __importStar(require("express"));
const InterfaceFacade_1 = require("../../../interfaces/InterfaceFacade");
const swagger_1 = require("@tsed/swagger");
const ContestBuilder_service_1 = __importDefault(require("../../../services/contest/ContestBuilder.service"));
const Contests_service_1 = require("../../../services/contest/Contests.service");
/**
 * REST end-point for contests
 */
let ContestsCtrl = class ContestsCtrl {
    constructor(contestBuilder, contestService) {
        this.contestBuilder = contestBuilder;
        this.contestService = contestService;
    }
    /**
     * End-point to create contests
     * @param name name of the contest
     * @param startDateYear start date year of the contest
     * @param startDateMonth start date month of the contest
     * @param startDateDay start date day of the contest
     * @param endDateYear end date year of the contest
     * @param endDateMonth end date month of the contest
     * @param endDateDay end date day of the contest
     * @param startTimeHour start time hour of the contest
     * @param startTimeMinute start time minute of the contest
     * @param endTimeHour end time hour of the contest
     * @param endTimeMinute end time minute of the contest
     * @param access public or private contest
     * @param type individual or team contest
     */
    create(name, startDateYear, startDateMonth, startDateDay, endDateYear, endDateMonth, endDateDay, startTimeHour, startTimeMinute, endTimeHour, endTimeMinute, access, type, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contestType;
                let accessType;
                if (type.toUpperCase() == "TEAM") {
                    contestType = InterfaceFacade_1.ContestType.TEAM;
                }
                else {
                    contestType = InterfaceFacade_1.ContestType.INDIVIDUAL;
                }
                if (access.toUpperCase() == "PRIVATE") {
                    accessType = InterfaceFacade_1.AccessType.PRIVATE;
                }
                else {
                    accessType = InterfaceFacade_1.AccessType.PUBLIC;
                }
                let contest = {
                    name: name,
                    startDateYear: startDateYear,
                    startDateMonth: startDateMonth,
                    startDateDay: startDateDay,
                    endDateYear: endDateYear,
                    endDateMonth: endDateMonth,
                    endDateDay: endDateDay,
                    startTimeHour: startTimeHour,
                    startTimeMinute: startTimeMinute,
                    endTimeHour: endTimeHour,
                    endTimeMinute: endTimeMinute,
                    access: accessType,
                    owner: request.user._id
                };
                let contests = this.contestBuilder.createContest(contestType);
                try {
                    result = yield contests.create(contest, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Return all coming contests
     * @param request
     * @param response
     */
    getAllComingContests(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getAllComingContests();
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Return all running contests
     * @param request
     * @param response
     */
    getAllRunningContests(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getAllRunningContests();
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Return some past contests
     * @param request
     * @param response
     */
    getSomePastContests(request, response, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getPastContests(page);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getComingContests(request, response, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getComingContests(username);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getRunningContests(request, response, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getRunningContests(username);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getContests(request, response, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getContests(username);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Return a specific contest identified by its ID
     * @param constestID
     * @param request
     * @param response
     */
    getContest(contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getContest(contestID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Update contest info
     * @param startDateYear start date year of the contest
     * @param startDateMonth start date month of the contest
     * @param startDateDay start date day of the contest
     * @param endDateYear end date year of the contest
     * @param endDateMonth end date month of the contest
     * @param endDateDay end date day of the contest
     * @param startTimeHour start time hour of the contest
     * @param startTimeMinute start time minute of the contest
     * @param endTimeHour end time hour of the contest
     * @param endTimeMinute end time minute of the contest
     * @param access
     * @param type
     * @param contestID
     */
    updateContest(startDateYear, startDateMonth, startDateDay, endDateYear, endDateMonth, endDateDay, startTimeHour, startTimeMinute, endTimeHour, endTimeMinute, access, type, contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contestType;
                let accessType;
                let isAccess = false;
                if (access) {
                    isAccess = true;
                    if (access.toUpperCase() == "PRIVATE") {
                        accessType = InterfaceFacade_1.AccessType.PRIVATE;
                    }
                    else {
                        accessType = InterfaceFacade_1.AccessType.PUBLIC;
                    }
                }
                let contest = {
                    name: "",
                    startDateYear: startDateYear,
                    startDateMonth: startDateMonth,
                    startDateDay: startDateDay,
                    endDateYear: endDateYear,
                    endDateMonth: endDateMonth,
                    endDateDay: endDateDay,
                    startTimeHour: startTimeHour,
                    startTimeMinute: startTimeMinute,
                    endTimeHour: endTimeHour,
                    endTimeMinute: endTimeMinute,
                    access: accessType,
                    owner: request.user._id
                };
                try {
                    result = yield this.contestService.updateContest(contest, contestID, isAccess);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    deletecontest(contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.deleteContest(contestID, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getContestSubmissions(contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                try {
                    result = yield this.contestService.getContestType(contestID);
                    contest = this.contestBuilder.createContest(result.body.result);
                    result = yield contest.getSubmissions(contestID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getContestProblems(contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.getProblems(contestID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getContestRegistrants(contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                try {
                    result = yield this.contestService.getContestType(contestID);
                    contest = this.contestBuilder.createContest(result.body.result);
                    result = yield contest.getRegistrants(contestID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getContestStanding(contestID, page, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                try {
                    result = yield this.contestService.getContestType(contestID);
                    contest = this.contestBuilder.createContest(result.body.result);
                    result = yield contest.getStanding(contestID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    updateContestStanding(contestID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                try {
                    result = yield this.contestService.getContestType(contestID);
                    contest = this.contestBuilder.createContest(result.body.result);
                    result = yield contest.updateStanding(contestID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Add specific problem to the the contest only by the contest owner
     * @param contestID
     * @param problem
     * @param request
     * @param response
     */
    addSpecificProblems(contestID, problem, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.addSpecificProblem(contestID, problem, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Add problems from a codeforces contest
     * @param contestID
     * @param problem
     * @param request
     * @param response
     */
    addProblemsFromCodeforces(contestID, codeforceID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.addProblemsFromCodeforces(contestID, codeforceID, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Add problems from uva/uhunt contest
     * @param contestID
     * @param problems
     * @param request
     * @param response
     */
    addProblemsFromUva(contestID, problems, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.addProblemsFromUVA(contestID, problems, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Add problems from an existing contest
     * @param contestID
     * @param existingID
     * @param request
     * @param response
     */
    addProblemsFromExistingContest(contestID, existingID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.addProblemsFromExisting(contestID, existingID, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Add random problems
     * @param contestID
     * @param quantity
     * @param plateform
     * @param request
     * @param response
     */
    addRandomProblems(contestID, quantity, plateform, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.addRandomProblems(contestID, quantity, request.user._id, plateform);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Register a user to the contest
     * @param contestID
     * @param username
     * @param request
     * @param response
     */
    registerUser(contestID, username, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                contest = this.contestBuilder.createContest(InterfaceFacade_1.ContestType.INDIVIDUAL);
                try {
                    result = yield contest.register(contestID, username);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Register a team to the contest
     * @param contestID
     * @param teamID
     * @param request
     * @param response
     */
    registerTeam(contestID, teamID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                contest = this.contestBuilder.createContest(InterfaceFacade_1.ContestType.TEAM);
                try {
                    result = yield contest.register(contestID, teamID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Delete a contest problem
     * @param contestID
     * @param problemID
     * @param request
     * @param response
     */
    deleteProblem(contestID, problemID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.contestService.removeProblem(contestID, problemID, request.user._id);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Delete a contest user
     * @param contestID
     * @param userID
     * @param request
     * @param response
     */
    unregisterUser(contestID, userID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                contest = this.contestBuilder.createContest(InterfaceFacade_1.ContestType.INDIVIDUAL);
                try {
                    result = yield contest.unregister(contestID, userID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    /**
     * Delete a contest team
     * @param contestID
     * @param teamID
     * @param request
     * @param response
     */
    unregisterTeam(contestID, teamID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contest;
                contest = this.contestBuilder.createContest(InterfaceFacade_1.ContestType.TEAM);
                try {
                    result = yield contest.unregister(contestID, teamID);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
};
__decorate([
    common_1.Post("/"),
    swagger_1.Summary("Create a contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("name")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("startDateYear")),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams("startDateMonth")),
    __param(3, common_1.Required()), __param(3, common_1.BodyParams("startDateDay")),
    __param(4, common_1.Required()), __param(4, common_1.BodyParams("endDateYear")),
    __param(5, common_1.Required()), __param(5, common_1.BodyParams("endDateMonth")),
    __param(6, common_1.Required()), __param(6, common_1.BodyParams("endDateDay")),
    __param(7, common_1.BodyParams("startTimeHour")),
    __param(8, common_1.BodyParams("startTimeMinute")),
    __param(9, common_1.BodyParams("endTimeHour")),
    __param(10, common_1.BodyParams("endTimeMinute")),
    __param(11, common_1.Required()), __param(11, common_1.BodyParams("access")),
    __param(12, common_1.Required()), __param(12, common_1.BodyParams("type")),
    __param(13, common_1.Req()),
    __param(14, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "create", null);
__decorate([
    common_1.Get("/coming"),
    swagger_1.Summary("Get all coming public contests"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getAllComingContests", null);
__decorate([
    common_1.Get("/running"),
    swagger_1.Summary("Get all running public contests"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getAllRunningContests", null);
__decorate([
    common_1.Get("/past"),
    swagger_1.Summary("Get some past public contests"),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.QueryParams("page")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getSomePastContests", null);
__decorate([
    common_1.Get("/mycoming"),
    swagger_1.Summary("Coming contests registered by the user"),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.QueryParams("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getComingContests", null);
__decorate([
    common_1.Get("/myrunning"),
    swagger_1.Summary("Running contests registered by the user"),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.QueryParams("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getRunningContests", null);
__decorate([
    common_1.Get("/mypast"),
    swagger_1.Summary("Past contests attended by the user"),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.QueryParams("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getContests", null);
__decorate([
    common_1.Get("/:id"),
    swagger_1.Summary("Get a specific contest"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getContest", null);
__decorate([
    common_1.Put("/:id"),
    common_1.Authenticated(),
    swagger_1.Summary("Update contest info"),
    __param(0, common_1.BodyParams("startDateYear")),
    __param(1, common_1.BodyParams("startDateMonth")),
    __param(2, common_1.BodyParams("startDateDay")),
    __param(3, common_1.BodyParams("endDateYear")),
    __param(4, common_1.BodyParams("endDateMonth")),
    __param(5, common_1.BodyParams("endDateDay")),
    __param(6, common_1.BodyParams("startTimeHour")),
    __param(7, common_1.BodyParams("startTimeMinute")),
    __param(8, common_1.BodyParams("endTimeHour")),
    __param(9, common_1.BodyParams("endTimeMinute")),
    __param(10, common_1.BodyParams("access")),
    __param(11, common_1.BodyParams("type")),
    __param(12, common_1.Required()), __param(12, common_1.PathParams("id")),
    __param(13, common_1.Req()),
    __param(14, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "updateContest", null);
__decorate([
    common_1.Delete("/:id"),
    swagger_1.Summary("Delete a specific contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "deletecontest", null);
__decorate([
    common_1.Get("/:id/submissions"),
    swagger_1.Summary("Get contest submissions"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getContestSubmissions", null);
__decorate([
    common_1.Get("/:id/problems"),
    swagger_1.Summary("Get contest problems"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getContestProblems", null);
__decorate([
    common_1.Get("/:id/registrants"),
    swagger_1.Summary("Get contest registrants"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getContestRegistrants", null);
__decorate([
    common_1.Get("/:id/standing"),
    swagger_1.Summary("Get contest standing"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.QueryParams("page")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "getContestStanding", null);
__decorate([
    common_1.Get("/:id/update"),
    swagger_1.Summary("Update contest standing"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "updateContestStanding", null);
__decorate([
    common_1.Post("/:id/specificproblem"),
    swagger_1.Summary("Add problems to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("problem")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "addSpecificProblems", null);
__decorate([
    common_1.Post("/:id/codeforcecontest"),
    swagger_1.Summary("Add problems to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("id")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "addProblemsFromCodeforces", null);
__decorate([
    common_1.Post("/:id/uvacontest"),
    swagger_1.Summary("Add problems to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("problem")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "addProblemsFromUva", null);
__decorate([
    common_1.Post("/:id/existingcontest"),
    swagger_1.Summary("Add problems to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("id")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "addProblemsFromExistingContest", null);
__decorate([
    common_1.Post("/:id/randomproblems"),
    swagger_1.Summary("Add problems to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("quantity")),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams("oj")),
    __param(3, common_1.Req()),
    __param(4, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "addRandomProblems", null);
__decorate([
    common_1.Post("/:id/registerUser"),
    swagger_1.Summary("Register a user to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.BodyParams("username")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "registerUser", null);
__decorate([
    common_1.Post("/:id/registerTeam"),
    swagger_1.Summary("Register a team to the contest"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.BodyParams("teamID")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "registerTeam", null);
__decorate([
    common_1.Delete("/:id/problems/:pid"),
    common_1.MergeParams(),
    swagger_1.Summary("Delete a contest problem"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.PathParams("pid")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "deleteProblem", null);
__decorate([
    common_1.Delete("/:id/unregisterUser"),
    swagger_1.Summary("Delete a contest registrant"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.QueryParams("userID")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "unregisterUser", null);
__decorate([
    common_1.Delete("/:id/unregisterTeam"),
    common_1.MergeParams(),
    swagger_1.Summary("Delete a contest team"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.QueryParams("teamID")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContestsCtrl.prototype, "unregisterTeam", null);
ContestsCtrl = __decorate([
    common_1.Controller("/contests"),
    __metadata("design:paramtypes", [ContestBuilder_service_1.default,
        Contests_service_1.ContestsService])
], ContestsCtrl);
exports.ContestsCtrl = ContestsCtrl;
//# sourceMappingURL=contests.controller.js.map