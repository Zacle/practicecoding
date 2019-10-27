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
let Submissions = class Submissions {
};
__decorate([
    swagger_1.Description("Submission ID"),
    __metadata("design:type", String)
], Submissions.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("OJ Submission ID"),
    __metadata("design:type", Number)
], Submissions.prototype, "submissionID", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Submission Time"),
    __metadata("design:type", Date)
], Submissions.prototype, "submissionTime", void 0);
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Submissions.prototype, "problemID", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("The name of the problem"),
    __metadata("design:type", String)
], Submissions.prototype, "problemName", void 0);
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Submissions.prototype, "problemLink", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Online judge of the submission"),
    __metadata("design:type", String)
], Submissions.prototype, "OJ", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("verdict of the submission"),
    __metadata("design:type", String)
], Submissions.prototype, "verdict", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Programming language of the submission"),
    __metadata("design:type", String)
], Submissions.prototype, "language", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    swagger_1.Description("Contestant submission if INDIVIDUAL contest"),
    __metadata("design:type", Object)
], Submissions.prototype, "user", void 0);
__decorate([
    mongoose_1.Ref("Teams"),
    swagger_1.Description("Contestants submission if TEAM contest"),
    __metadata("design:type", Object)
], Submissions.prototype, "team", void 0);
Submissions = __decorate([
    mongoose_1.Model()
], Submissions);
exports.Submissions = Submissions;
//# sourceMappingURL=Submissions.js.map