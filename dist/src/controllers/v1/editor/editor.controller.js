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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Express = __importStar(require("express"));
const swagger_1 = require("@tsed/swagger");
const Editor_service_1 = require("../../../services/editor/Editor.service");
let EditorCtrl = class EditorCtrl {
    constructor(editorService) {
        this.editorService = editorService;
    }
    post(language, theme, input, source, name, request, response) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.editorService.post(language, theme, input, source, request.user._id, name);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        }));
    }
    myCodes(response, request) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.editorService.myCodes(request.user._id);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        }));
    }
    get(uri, response) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.editorService.get(uri);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        }));
    }
    put(language, theme, input, source, uri, request, response) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.editorService.put(language, theme, input, source, request.user._id, uri);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        }));
    }
    delete(response, id, request) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.editorService.delete(id, request.user._id);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch (err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        }));
    }
};
__decorate([
    common_1.Post("/"),
    swagger_1.Summary("Compile and Run the source code"),
    common_1.Authenticated(),
    __param(0, common_1.BodyParams("language")),
    __param(1, common_1.BodyParams("theme")),
    __param(2, common_1.BodyParams("input")),
    __param(3, common_1.BodyParams("source")),
    __param(4, common_1.BodyParams("name")),
    __param(5, common_1.Req()),
    __param(6, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], EditorCtrl.prototype, "post", null);
__decorate([
    common_1.Get("/my"),
    swagger_1.Summary("Get user source codes"),
    common_1.Authenticated(),
    __param(0, common_1.Res()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EditorCtrl.prototype, "myCodes", null);
__decorate([
    common_1.Get("/:uri"),
    swagger_1.Summary("Get the source code"),
    __param(0, common_1.PathParams("uri")),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EditorCtrl.prototype, "get", null);
__decorate([
    common_1.Put("/:uri"),
    swagger_1.Summary("Modify, Compile and Run the source code"),
    common_1.Authenticated(),
    __param(0, common_1.BodyParams("language")),
    __param(1, common_1.BodyParams("theme")),
    __param(2, common_1.BodyParams("input")),
    __param(3, common_1.BodyParams("source")),
    __param(4, common_1.PathParams("uri")),
    __param(5, common_1.Req()),
    __param(6, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], EditorCtrl.prototype, "put", null);
__decorate([
    common_1.Delete("/:id"),
    swagger_1.Summary("Delete this source code"),
    common_1.Authenticated(),
    __param(0, common_1.Res()), __param(1, common_1.PathParams("id")), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], EditorCtrl.prototype, "delete", null);
EditorCtrl = __decorate([
    common_1.Controller("/editor"),
    __metadata("design:paramtypes", [Editor_service_1.EditorService])
], EditorCtrl);
exports.EditorCtrl = EditorCtrl;
//# sourceMappingURL=editor.controller.js.map