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
let GroupMembers = class GroupMembers {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], GroupMembers.prototype, "_id", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Member of the group"),
    __metadata("design:type", Object)
], GroupMembers.prototype, "user", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Admin or Participant"),
    __metadata("design:type", String)
], GroupMembers.prototype, "membershipType", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Date the user joined the group"),
    __metadata("design:type", Date)
], GroupMembers.prototype, "joined", void 0);
GroupMembers = __decorate([
    mongoose_1.Model()
], GroupMembers);
exports.GroupMembers = GroupMembers;
//# sourceMappingURL=GroupMembers.js.map