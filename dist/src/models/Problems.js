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
/*
 * The model that will be used to save problems gathered
 * from different platforms in the database
*/
let Problems = class Problems {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Problems.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("ID of the problem"),
    __metadata("design:type", String)
], Problems.prototype, "problemID", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Contest ID of the problem"),
    __metadata("design:type", Number)
], Problems.prototype, "contestID", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Name of the problem"),
    __metadata("design:type", String)
], Problems.prototype, "name", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("The plateform name"),
    __metadata("design:type", String)
], Problems.prototype, "plateform", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("The URI of the problem"),
    __metadata("design:type", String)
], Problems.prototype, "link", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("The level of the problem"),
    __metadata("design:type", String)
], Problems.prototype, "difficulty", void 0);
Problems = __decorate([
    mongoose_1.Model()
], Problems);
exports.Problems = Problems;
//# sourceMappingURL=Problems.js.map