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
const Contests_1 = require("./contests/Contests");
let Teams = class Teams {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Teams.prototype, "_id", void 0);
__decorate([
    mongoose_1.Ref(Contests_1.Contests),
    swagger_1.Description("Contests the team has participated"),
    __metadata("design:type", Array)
], Teams.prototype, "contests", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Admin of the team"),
    __metadata("design:type", Object)
], Teams.prototype, "admin", void 0);
__decorate([
    common_1.PropertyType(Date),
    swagger_1.Description("Creation date of the team"),
    __metadata("design:type", Date)
], Teams.prototype, "creation", void 0);
__decorate([
    common_1.Property(),
    mongoose_1.Unique(),
    swagger_1.Description("Team's name"),
    __metadata("design:type", String)
], Teams.prototype, "name", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    swagger_1.Description("Members of the teams"),
    __metadata("design:type", Array)
], Teams.prototype, "members", void 0);
Teams = __decorate([
    mongoose_1.Model()
], Teams);
exports.Teams = Teams;
//# sourceMappingURL=Teams.js.map