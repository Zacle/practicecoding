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
const Teams_1 = require("../Teams");
let Trackers = class Trackers {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Trackers.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Participant's country"),
    __metadata("design:type", String)
], Trackers.prototype, "country", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Number of problems solved"),
    __metadata("design:type", Number)
], Trackers.prototype, "solvedCount", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Penalty of user submissions"),
    __metadata("design:type", Number)
], Trackers.prototype, "penalty", void 0);
__decorate([
    common_1.Property(),
    common_1.PropertyType(Number),
    swagger_1.Description("Problems solved by the user during the contest"),
    __metadata("design:type", Array)
], Trackers.prototype, "solved", void 0);
__decorate([
    common_1.Property(),
    common_1.PropertyType(Number),
    swagger_1.Description("Problems not solved by the user during the contest"),
    __metadata("design:type", Array)
], Trackers.prototype, "unSolved", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Contest participant"),
    __metadata("design:type", Object)
], Trackers.prototype, "contestant", void 0);
__decorate([
    mongoose_1.Ref(Teams_1.Teams),
    common_1.Property(),
    swagger_1.Description("Team participant"),
    __metadata("design:type", Object)
], Trackers.prototype, "contestants", void 0);
__decorate([
    mongoose_1.Ref("Contests"),
    common_1.Property(),
    swagger_1.Description("Contest ID for this tracker"),
    __metadata("design:type", Object)
], Trackers.prototype, "contestID", void 0);
Trackers = __decorate([
    mongoose_1.Model()
], Trackers);
exports.Trackers = Trackers;
//# sourceMappingURL=Trackers.js.map