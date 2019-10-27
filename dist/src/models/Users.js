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
const Teams_1 = require("./Teams");
const Groups_1 = require("./Groups");
const Contests_1 = require("./contests/Contests");
let Users = class Users {
    constructor() {
        this.joined = new Date();
    }
};
__decorate([
    swagger_1.Description("ID of each user"),
    __metadata("design:type", String)
], Users.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    common_1.Email(),
    swagger_1.Description("Email of the user"),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    common_1.Property(),
    common_1.Required(),
    swagger_1.Description("Password of the user"),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Codeforces Handle"),
    __metadata("design:type", Date)
], Users.prototype, "joined", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Wheter the account is activated or not"),
    __metadata("design:type", Boolean)
], Users.prototype, "activated", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Token to validate email"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "emailValidationToken", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Reset token for the password"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "passwordResetToken", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("The Expiration time of the password token sent"),
    __metadata("design:type", Number)
], Users.prototype, "passwordResetExpires", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Reset token for the email"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "emailResetToken", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("The Expiration time of the email token sent"),
    __metadata("design:type", Number)
], Users.prototype, "emailResetExpires", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Facebook OAuth for login"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "facebook", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Google OAuth for login"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "google", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("GitHub OAuth for login"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "github", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Twitter OAuth for login"),
    common_1.Default(""),
    __metadata("design:type", String)
], Users.prototype, "twitter", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Codeforces Handle"),
    __metadata("design:type", String)
], Users.prototype, "codeforces", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Uva Handle"),
    __metadata("design:type", String)
], Users.prototype, "uva", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Live Archive Handle"),
    __metadata("design:type", String)
], Users.prototype, "livearchive", void 0);
__decorate([
    common_1.Property(),
    common_1.Required(),
    swagger_1.Description("User Full name"),
    __metadata("design:type", String)
], Users.prototype, "fullname", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("User name that will be displayed"),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    common_1.Property(),
    common_1.Required(),
    swagger_1.Description("User Country"),
    __metadata("design:type", String)
], Users.prototype, "country", void 0);
__decorate([
    common_1.Property(),
    common_1.Default(false),
    swagger_1.Description("Whether or not the user is an admin"),
    __metadata("design:type", Boolean)
], Users.prototype, "admin", void 0);
__decorate([
    mongoose_1.Ref(Teams_1.Teams),
    swagger_1.Description("Teams the user belongs to"),
    __metadata("design:type", Array)
], Users.prototype, "teams", void 0);
__decorate([
    mongoose_1.Ref(Groups_1.Groups),
    swagger_1.Description("Groups the user belongs to"),
    __metadata("design:type", Array)
], Users.prototype, "groups", void 0);
__decorate([
    mongoose_1.Ref(Contests_1.Contests),
    swagger_1.Description("Contests attended by the user"),
    __metadata("design:type", Array)
], Users.prototype, "contests", void 0);
Users = __decorate([
    mongoose_1.Model()
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map