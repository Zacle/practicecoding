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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Todos_1 = require("../../models/Todos");
let TodosService = class TodosService {
    constructor(todos) {
        this.todos = todos;
    }
    /**
     * Add the problem to the todos list
     * @param data
     * @param userID
     */
    add(problemID, userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let todo = {
                added: new Date(),
                user: userID,
                problemID: problemID
            };
            try {
                let todoExists = yield this.todos.findOne({ problemID: problemID }).exec();
                if (todoExists) {
                    return reject({
                        code: 406 /* NOT_ACCEPTABLE */,
                        body: {
                            name: "This problem is already in your todo list"
                        }
                    });
                }
                let saveTodo = new this.todos(todo);
                yield saveTodo.save();
                return resolve({
                    code: 201 /* CREATED */,
                    body: {
                        result: saveTodo
                    }
                });
            }
            catch (err) {
                console.log("TODO ERROR: ", err);
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't save to the todos list"
                    }
                });
            }
        }));
    }
    /**
     * Remove the problem from the todos list
     * @param problemID
     * @param userID
     */
    remove(problemID, userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let todo;
            try {
                todo = yield this.todos.findOneAndRemove({ problemID: problemID, user: userID }).exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: todo
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't remove the todo"
                    }
                });
            }
        }));
    }
    /**
     * Get the todos list of this user
     * @param userID
     */
    get(userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let todo;
            try {
                todo = yield this.todos.find({ user: userID }).populate("problemID").exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: todo
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get the todos list"
                    }
                });
            }
        }));
    }
};
TodosService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Todos_1.Todos)),
    __metadata("design:paramtypes", [Object])
], TodosService);
exports.TodosService = TodosService;
//# sourceMappingURL=Todo.service.js.map