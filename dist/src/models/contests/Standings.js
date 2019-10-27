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
const Trackers_1 = require("./Trackers");
let Standings = class Standings {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Standings.prototype, "_id", void 0);
__decorate([
    mongoose_1.Ref(Trackers_1.Trackers),
    common_1.Property(),
    swagger_1.Description("Track user progress during the contest"),
    __metadata("design:type", Array)
], Standings.prototype, "trackers", void 0);
__decorate([
    mongoose_1.Ref("Contests"),
    common_1.Property(),
    swagger_1.Description("Contest ID for this standing"),
    __metadata("design:type", Object)
], Standings.prototype, "contestID", void 0);
Standings = __decorate([
    mongoose_1.Model()
], Standings);
exports.Standings = Standings;
//# sourceMappingURL=Standings.js.map