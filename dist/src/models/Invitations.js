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
let Invitations = class Invitations {
};
__decorate([
    common_1.IgnoreProperty(),
    __metadata("design:type", String)
], Invitations.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("ID of the user who sent the invitation"),
    __metadata("design:type", String)
], Invitations.prototype, "senderID", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Username of the user who sent the invitation"),
    __metadata("design:type", String)
], Invitations.prototype, "senderUsername", void 0);
__decorate([
    common_1.PropertyType(Date),
    swagger_1.Description("Time that the invitation was sent"),
    __metadata("design:type", Date)
], Invitations.prototype, "sentAt", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("receiver read or not the invitation"),
    __metadata("design:type", Boolean)
], Invitations.prototype, "read", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("link to the invitation place"),
    __metadata("design:type", String)
], Invitations.prototype, "link", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("User accepted or declined the invitation"),
    __metadata("design:type", Boolean)
], Invitations.prototype, "expired", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("username of the receiver"),
    __metadata("design:type", String)
], Invitations.prototype, "receiverUsername", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("ID of the receiver"),
    __metadata("design:type", String)
], Invitations.prototype, "receiverID", void 0);
Invitations = __decorate([
    mongoose_1.Model()
], Invitations);
exports.Invitations = Invitations;
//# sourceMappingURL=Invitations.js.map