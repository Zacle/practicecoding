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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Express = __importStar(require("express"));
const swagger_1 = require("@tsed/swagger");
const Teams_service_1 = require("../../../services/team/Teams.service");
let TeamsCtrl = class TeamsCtrl {
    constructor(teams) {
        this.teams = teams;
    }
    getAllTeams(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.getAllTeams();
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    console.log("SUCCESS: ", result.body.result);
                    response.json(result.body.result);
                    resolve();
                }
                catch (err) {
                    console.log("FAILURE: ", err);
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    getTeams(request, response, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.getTeams(username);
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
    getMyTeams(request, response, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.getMyTeams(username);
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.result);
                    resolve(result.body.result);
                }
                catch (err) {
                    console.log("ERROR: ", err);
                    result = err;
                    response.status(result.code);
                    response.setHeader("Content-Type", "application/json");
                    response.json(result.body.name);
                    reject(result.body.name);
                }
            }));
        });
    }
    addTeam(name, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.createTeam(name, request.user._id);
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
    deleteTeams(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.deleteTeams();
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
    getTeam(teamID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.getTeam(teamID);
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
    deleteTeam(teamID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.deleteam(teamID, request.user._id);
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
    getTeamMembers(teamID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.getTeamMembers(teamID);
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
    addTeamMember(teamID, userID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.addTeamMember(teamID, userID);
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
    deleteTeamMember(teamID, userID, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield this.teams.deleteTeamMember(teamID, userID);
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
    swagger_1.Summary("Get all teams"),
    common_1.Authenticated({ role: "admin" }),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "getAllTeams", null);
__decorate([
    common_1.Get("/my"),
    swagger_1.Summary("Get all teams that contain the user"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __param(2, common_1.Required()), __param(2, common_1.QueryParams("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "getTeams", null);
__decorate([
    common_1.Get("/myown"),
    swagger_1.Summary("Get all teams that contain the user"),
    common_1.Authenticated(),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __param(2, common_1.Required()), __param(2, common_1.QueryParams("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "getMyTeams", null);
__decorate([
    common_1.Post("/"),
    swagger_1.Summary("Add a new team"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams("name")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "addTeam", null);
__decorate([
    common_1.Delete("/"),
    swagger_1.Summary("Delete all teams"),
    common_1.Authenticated({ role: 'admin' }),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "deleteTeams", null);
__decorate([
    common_1.Get("/:id"),
    swagger_1.Summary("Get a specific team"),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "getTeam", null);
__decorate([
    common_1.Delete("/:id"),
    swagger_1.Summary("Delete a team"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "deleteTeam", null);
__decorate([
    common_1.Get("/:id/members"),
    swagger_1.Summary("Get team members"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "getTeamMembers", null);
__decorate([
    common_1.Post("/:id/members"),
    swagger_1.Summary("Add a user to the team"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams("uid")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "addTeamMember", null);
__decorate([
    common_1.Delete("/:id/members"),
    common_1.MergeParams(),
    swagger_1.Summary("Delete a user from the team"),
    common_1.Authenticated(),
    __param(0, common_1.Required()), __param(0, common_1.PathParams("id")),
    __param(1, common_1.Required()), __param(1, common_1.QueryParams("uid")),
    __param(2, common_1.Req()),
    __param(3, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], TeamsCtrl.prototype, "deleteTeamMember", null);
TeamsCtrl = __decorate([
    common_1.Controller("/teams"),
    __metadata("design:paramtypes", [Teams_service_1.TeamsService])
], TeamsCtrl);
exports.TeamsCtrl = TeamsCtrl;
//# sourceMappingURL=teams.controller.js.map