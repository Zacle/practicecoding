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
const Problems_1 = require("./Problems");
let Todos = class Todos {
};
__decorate([
    common_1.Property(),
    __metadata("design:type", String)
], Todos.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Date that this was added"),
    __metadata("design:type", Date)
], Todos.prototype, "added", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("The user that added this todo"),
    __metadata("design:type", Object)
], Todos.prototype, "user", void 0);
__decorate([
    mongoose_1.Ref(Problems_1.Problems),
    common_1.Property(),
    swagger_1.Description("Problem to solve"),
    __metadata("design:type", Object)
], Todos.prototype, "problemID", void 0);
Todos = __decorate([
    mongoose_1.Model()
], Todos);
exports.Todos = Todos;
//# sourceMappingURL=Todos.js.map