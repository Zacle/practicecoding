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
let Editor = class Editor {
};
__decorate([
    common_1.Property(),
    common_1.Default(""),
    swagger_1.Description("Input to test the source code"),
    __metadata("design:type", String)
], Editor.prototype, "input", void 0);
__decorate([
    common_1.Any(),
    swagger_1.Description("Ouput of the source code"),
    __metadata("design:type", Object)
], Editor.prototype, "output", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Name of the source code"),
    __metadata("design:type", String)
], Editor.prototype, "name", void 0);
__decorate([
    common_1.Property(),
    mongoose_1.Unique(),
    swagger_1.Description("Unique URI to access the source code"),
    __metadata("design:type", String)
], Editor.prototype, "uri", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Theme the used to write the code"),
    __metadata("design:type", String)
], Editor.prototype, "theme", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Source code"),
    __metadata("design:type", String)
], Editor.prototype, "source", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Language of the source code"),
    __metadata("design:type", String)
], Editor.prototype, "language", void 0);
__decorate([
    mongoose_1.Ref("Users"),
    common_1.Property(),
    swagger_1.Description("Author of the source code"),
    __metadata("design:type", Object)
], Editor.prototype, "author", void 0);
Editor = __decorate([
    mongoose_1.Model()
], Editor);
exports.Editor = Editor;
//# sourceMappingURL=Editor.js.map