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
const swagger_1 = require("@tsed/swagger");
const Express = __importStar(require("express"));
const Todo_service_1 = require("../../../services/todo/Todo.service");
let TodosCtrl = class TodosCtrl {
    constructor(todos) {
        this.todos = todos;
    }
    get(request, response) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield this.todos.get(request.user._id);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        }));
    }
    post(request, response, problemID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield this.todos.add(problemID, request.user._id);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        }));
    }
    delete(request, response, problemID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield this.todos.remove(problemID, request.user._id);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        }));
    }
};
__decorate([
    common_1.Get("/"),
    swagger_1.Summary("Get all todos"),
    common_1.Authenticated(),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TodosCtrl.prototype, "get", null);
__decorate([
    common_1.Post("/"),
    swagger_1.Summary("Add a todo"),
    common_1.Authenticated(),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.BodyParams("problemID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TodosCtrl.prototype, "post", null);
__decorate([
    common_1.Delete("/"),
    swagger_1.Summary("Delete a todo"),
    common_1.Authenticated(),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.QueryParams("problemID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TodosCtrl.prototype, "delete", null);
TodosCtrl = __decorate([
    common_1.Controller("/todos"),
    __metadata("design:paramtypes", [Todo_service_1.TodosService])
], TodosCtrl);
exports.TodosCtrl = TodosCtrl;
//# sourceMappingURL=todos.controller.js.map