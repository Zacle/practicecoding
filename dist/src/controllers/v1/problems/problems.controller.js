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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const Plateform_service_1 = require("../../../services/plateform/Plateform.service");
const PlateformBuilding_service_1 = __importDefault(require("../../../services/plateformBuilder/PlateformBuilding.service"));
const swagger_1 = require("@tsed/swagger");
const Express = __importStar(require("express"));
/*
 * REST end-point to access problems saved in our database
*/
let ProblemsCtrl = class ProblemsCtrl {
    constructor(plateformB, allPlateforms) {
        this.plateformB = plateformB;
        this.allPlateforms = allPlateforms;
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let plat = this.plateformB.createPlateform("all");
                let res;
                try {
                    res = yield plat.getListOfProblems();
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
        });
    }
    getAllProblems(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let res;
                try {
                    res = yield this.allPlateforms.getAllProblems();
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
        });
    }
    get(request, response, next, key, plateform) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let plat = this.plateformB.createPlateform(plateform);
            let res;
            try {
                res = yield plat.getProblems(key);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.name);
                resolve(res.body.name);
            }
        }));
    }
    filter(request, response, page = 1, difficulty, plateform) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let plat = this.plateformB.createPlateform(plateform);
            let res;
            try {
                res = yield plat.getProblemsFiltered(difficulty, page);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            }
            catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.name);
                resolve(res.body.name);
            }
        }));
    }
};
__decorate([
    common_1.Post("/"),
    swagger_1.Summary("save all problems from Codeforces, Live Archive, Uva and save them in the database"),
    common_1.Authenticated({ role: 'admin' }),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Next()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProblemsCtrl.prototype, "save", null);
__decorate([
    common_1.Get("/"),
    swagger_1.Summary("get all problems from Codeforces, Live Archive, Uva and save them in the database"),
    common_1.Authenticated({ role: 'admin' }),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Next()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProblemsCtrl.prototype, "getAllProblems", null);
__decorate([
    common_1.Get("/:key"),
    swagger_1.Summary("Select all problems matching the key"),
    common_1.Authenticated(),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Next()),
    __param(3, common_1.PathParams("key")), __param(3, common_1.Required()),
    __param(4, common_1.QueryParams("plateform")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, String, String]),
    __metadata("design:returntype", Promise)
], ProblemsCtrl.prototype, "get", null);
__decorate([
    common_1.Get("/p/filter"),
    swagger_1.Summary("Filter all problems by difficulty"),
    common_1.Authenticated(),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.QueryParams("page")),
    __param(3, common_1.QueryParams("difficulty")), __param(3, common_1.Required()),
    __param(4, common_1.QueryParams("plateform")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, String, String]),
    __metadata("design:returntype", Promise)
], ProblemsCtrl.prototype, "filter", null);
ProblemsCtrl = __decorate([
    common_1.Controller("/problems"),
    __metadata("design:paramtypes", [PlateformBuilding_service_1.default, Plateform_service_1.AllPlateforms])
], ProblemsCtrl);
exports.ProblemsCtrl = ProblemsCtrl;
//# sourceMappingURL=problems.controller.js.map