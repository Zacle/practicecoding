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
const Groups_service_1 = require("../../../services/group/Groups.service");
const ContestBuilder_service_1 = __importDefault(require("../../../services/contest/ContestBuilder.service"));
const Contests_service_1 = require("../../../services/contest/Contests.service");
let GroupsCtrl = class GroupsCtrl {
    constructor(groups, contestBuilder, contestService) {
        this.groups = groups;
        this.contestBuilder = contestBuilder;
        this.contestService = contestService;
    }
    getAllGroups(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getAllGroups();
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve();
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
    getGroups(request, response, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getGroups(username);
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
    addGroup(name, access = "PUBLIC", description, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.createGroup(name, request.user._id, access.toUpperCase(), description);
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
    deleteGroups(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.deleteAllGroups();
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
    getGroup(groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getGroup(groupID);
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
    getGroupName(name, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getGroupName(name);
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
    updateGroup(groupID, description, access, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.updateGroup(groupID, access.toUpperCase(), request.user._id, description);
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
    deleteGroup(groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.deleteGroup(groupID, request.user._id);
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
    getGroupMembers(groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getGroupMembers(groupID);
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
     * End-point to create contests for a group
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
     * @param type individual or team contest
     */
    createContest(name, startDateYear, startDateMonth, startDateDay, endDateYear, endDateMonth, endDateDay, startTimeHour, startTimeMinute, endTimeHour, endTimeMinute, type, groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                let contestType;
                if (type.toUpperCase() == "TEAM") {
                    contestType = InterfaceFacade_1.ContestType.TEAM;
                }
                else {
                    contestType = InterfaceFacade_1.ContestType.INDIVIDUAL;
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
                    access: InterfaceFacade_1.AccessType.PRIVATE,
                    owner: request.user._id
                };
                let contests = this.contestBuilder.createContest(contestType);
                try {
                    result = yield contests.createGroupContest(contest, groupID, request.user._id);
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
     * Coming Contests of this group
     * @param groupID
     * @param request
     * @param response
     */
    getGroupComingContests(groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getComingContests(groupID);
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
     * Running Contests of this group
     * @param groupID
     * @param request
     * @param response
     */
    getGroupRunningContests(groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getRunningContests(groupID);
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
     * Past Contests of this group
     * @param groupID
     * @param request
     * @param response
     */
    getGroupPastContests(groupID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.getContests(groupID);
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
    addGroupMember(groupID, userID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.addGroupMember(groupID, userID);
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
    deleteGroupMember(groupID, userID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.groups.deleteGroupMember(groupID, userID);
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
    common_1.Get("/"),
    swagger_1.Summary("Get all groups that are public"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getAllGroups", null);
__decorate([
    common_1.Get("/my"),
    swagger_1.Summary("Get all groups that contain the user"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __param(2, common_1.Required()), __param(2, common_1.QueryParams("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroups", null);
__decorate([
    common_1.Post("/"),
    swagger_1.Summary("Add a new group"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("name")),
    __param(1, common_1.BodyParams("access")),
    __param(2, common_1.BodyParams("description")),
    __param(3, common_1.Req()),
    __param(4, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "addGroup", null);
__decorate([
    common_1.Delete("/"),
    swagger_1.Summary("Delete all groups"),
    common_1.Authenticated({ role: 'admin' }),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "deleteGroups", null);
__decorate([
    common_1.Get("/:id"),
    swagger_1.Summary("Get a specific group"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroup", null);
__decorate([
    common_1.Get("/by/:name"),
    swagger_1.Summary("Get a specific group by name"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("name")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroupName", null);
__decorate([
    common_1.Put("/:id"),
    swagger_1.Summary("Update a specific group"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.BodyParams("description")),
    __param(2, common_1.BodyParams("access")),
    __param(3, common_1.Req()),
    __param(4, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "updateGroup", null);
__decorate([
    common_1.Delete("/:id"),
    swagger_1.Summary("Delete a group"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "deleteGroup", null);
__decorate([
    common_1.Get("/:id/members"),
    swagger_1.Summary("Get group members"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroupMembers", null);
__decorate([
    common_1.Post("/:id/createcontest"),
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
    __param(11, common_1.Required()), __param(11, common_1.BodyParams("type")),
    __param(12, common_1.Required()), __param(12, common_1.PathParams("id")),
    __param(13, common_1.Req()),
    __param(14, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "createContest", null);
__decorate([
    common_1.Get("/:id/comingcontests"),
    swagger_1.Summary("Get group contests"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroupComingContests", null);
__decorate([
    common_1.Get("/:id/runningcontests"),
    swagger_1.Summary("Get group contests"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroupRunningContests", null);
__decorate([
    common_1.Get("/:id/pastcontests"),
    swagger_1.Summary("Get group contests"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "getGroupPastContests", null);
__decorate([
    common_1.Post("/:id/members"),
    swagger_1.Summary("Add a user to the group"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("uid")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "addGroupMember", null);
__decorate([
    common_1.Delete("/:id/members/"),
    swagger_1.Summary("Delete a user from the group"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.QueryParams("uid")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], GroupsCtrl.prototype, "deleteGroupMember", null);
GroupsCtrl = __decorate([
    common_1.Controller("/groups"),
    __metadata("design:paramtypes", [Groups_service_1.GroupsService,
        ContestBuilder_service_1.default,
        Contests_service_1.ContestsService])
], GroupsCtrl);
exports.GroupsCtrl = GroupsCtrl;
//# sourceMappingURL=groups.controller.js.map