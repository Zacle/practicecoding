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
const InterfaceFacade_1 = require("../interfaces/InterfaceFacade");
let Groups = class Groups {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Groups.prototype, "_id", void 0);
__decorate([
    mongoose_1.Ref("GroupMembers"),
    common_1.Property(),
    swagger_1.Description("Members of the group"),
    __metadata("design:type", Array)
], Groups.prototype, "members", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Public or Private group"),
    __metadata("design:type", Number)
], Groups.prototype, "access", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("What this group is all about"),
    __metadata("design:type", String)
], Groups.prototype, "description", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Admin(s) of the group"),
    __metadata("design:type", Object)
], Groups.prototype, "admin", void 0);
__decorate([
    mongoose_1.Ref(Contests_1.Contests),
    common_1.Property(),
    swagger_1.Description("Group contests"),
    __metadata("design:type", Array)
], Groups.prototype, "contests", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Create date of the group"),
    __metadata("design:type", Date)
], Groups.prototype, "creation", void 0);
__decorate([
    common_1.Property(),
    mongoose_1.Unique(),
    swagger_1.Description("Group name"),
    __metadata("design:type", String)
], Groups.prototype, "name", void 0);
Groups = __decorate([
    mongoose_1.Model()
], Groups);
exports.Groups = Groups;
//# sourceMappingURL=Groups.js.map