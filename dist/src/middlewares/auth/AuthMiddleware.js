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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Express = __importStar(require("express"));
const ts_log_debug_1 = require("ts-log-debug");
const passport_1 = __importDefault(require("passport"));
let AuthMiddleware = class AuthMiddleware {
    constructor() {
    }
    use(endpoint, request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // retrieve Options passed to the Authenticated() decorators.
            const options = endpoint.store.get(common_1.AuthenticatedMiddleware) || {};
            ts_log_debug_1.$log.debug("AuthMiddleware =>", options);
            ts_log_debug_1.$log.debug("AuthMiddleware isAuthenticated ? =>", request.isAuthenticated());
            return new Promise((resolve, reject) => {
                passport_1.default.authenticate('jwt', { session: false, }, (error, token) => __awaiter(this, void 0, void 0, function* () {
                    if (error || !token) {
                        response.status(401 /* UNAUTHORIZED */).json({ message: "Unauthorized " });
                        reject();
                    }
                    else {
                        const user = {
                            email: token.body.result.email,
                            _id: token.body.result._id,
                            username: token.body.result.username,
                            admin: token.body.result.admin
                        };
                        request.user = user;
                    }
                    if (options.role == "admin") {
                        if (!request.user.admin) {
                            response.status(401 /* UNAUTHORIZED */).json({ message: "Unauthorized " });
                        }
                    }
                    console.log("OUTSIDE AUTH: ", request.user);
                    resolve(next());
                }))(request, response, () => { });
            });
        });
    }
};
__decorate([
    __param(0, common_1.EndpointInfo()),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __param(3, common_1.Next()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_1.EndpointMetadata, Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthMiddleware.prototype, "use", null);
AuthMiddleware = __decorate([
    common_1.OverrideMiddleware(common_1.AuthenticatedMiddleware),
    __metadata("design:paramtypes", [])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map