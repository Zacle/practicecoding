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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Util_1 = __importDefault(require("../Util"));
/*
*   Problem class for each problem
*   Fields:
*       - id: id of the problem
*       - name: name of the problem
*       - plateform_name: name of the plateform (SPOJ, CODEFORCES, UVA, LIVEARCHIVE)
*       - link: link to the problem on the plateformName
*       - difficulty: difficulty of the problem of type Level
*/
let Problem = class Problem {
    constructor() {
        this.difficulty = null;
        Util_1.default.trace("ProblemImpl::init()");
    }
    setProblems(_id, _name, _plateform_name, _link, _stat) {
        this.id = _id;
        this.name = _name;
        this.plateform_name = _plateform_name;
        this.link = _link;
        this.difficulty = _stat;
    }
    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getPlateformName() {
        return this.plateform_name;
    }
    getProblemURI() {
        return this.link;
    }
    getProblemStatistic() {
        return this.difficulty;
    }
};
Problem = __decorate([
    common_1.Service(),
    __metadata("design:paramtypes", [])
], Problem);
exports.Problem = Problem;
//# sourceMappingURL=Problem.service.js.map