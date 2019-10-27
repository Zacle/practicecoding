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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const mongoose_1 = require("@tsed/mongoose");
const swagger_1 = require("@tsed/swagger");
const Problems_1 = require("../Problems");
const InterfaceFacade_1 = require("../../interfaces/InterfaceFacade");
let Contests = class Contests {
};
__decorate([
    swagger_1.Description("ContestID"),
    __metadata("design:type", String)
], Contests.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    mongoose_1.Unique(),
    swagger_1.Description("Contest name"),
    __metadata("design:type", String)
], Contests.prototype, "name", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Contest's start date"),
    __metadata("design:type", Date)
], Contests.prototype, "startDate", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Contest's end date"),
    __metadata("design:type", Date)
], Contests.prototype, "endDate", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Duration of the contest"),
    __metadata("design:type", String)
], Contests.prototype, "duration", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Owner of the contest"),
    __metadata("design:type", Object)
], Contests.prototype, "owner", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Private or public contest"),
    __metadata("design:type", Number)
], Contests.prototype, "access", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Individual or team contest"),
    __metadata("design:type", Number)
], Contests.prototype, "type", void 0);
__decorate([
    mongoose_1.Ref(Problems_1.Problems),
    common_1.Property(),
    swagger_1.Description("List of problems"),
    __metadata("design:type", Array)
], Contests.prototype, "problems", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Users registered in the contest"),
    __metadata("design:type", Array)
], Contests.prototype, "users", void 0);
__decorate([
    mongoose_1.Ref("Teams"),
    common_1.Property(),
    swagger_1.Description("Teams registered in the contest"),
    __metadata("design:type", Array)
], Contests.prototype, "teams", void 0);
__decorate([
    mongoose_1.Ref("Submissions"),
    common_1.Property(),
    swagger_1.Description("Contest's submissions"),
    __metadata("design:type", Array)
], Contests.prototype, "submissions", void 0);
__decorate([
    mongoose_1.Ref("Standings"),
    common_1.Property(),
    swagger_1.Description("Contest standing"),
    __metadata("design:type", Object)
], Contests.prototype, "standings", void 0);
Contests = __decorate([
    mongoose_1.Model()
], Contests);
exports.Contests = Contests;
//# sourceMappingURL=Contests.js.map