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
var PassportService_1;
const common_1 = require("@tsed/common");
const Passport = require("passport");
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const Users_service_1 = require("../users/Users.service");
const secrets_1 = require("../../util/secrets");
const jwt = require("jsonwebtoken");
let PassportService = PassportService_1 = class PassportService {
    constructor(usersService, serverSettings, expressApplication) {
        this.usersService = usersService;
        this.serverSettings = serverSettings;
        this.expressApplication = expressApplication;
        Passport.serializeUser(PassportService_1.serialize);
        Passport.deserializeUser(this.deserialize.bind(this));
    }
    /**
     *
     * @param user
     * @param done
     */
    static serialize(user, done) {
        done(null, user._id);
    }
    /**
     *
     * @param id
     * @param done
     */
    deserialize(id, done) {
        done(null, this.usersService.findById(id));
    }
    $beforeRoutesInit() {
        const options = this.serverSettings.get("passport") || {};
        this.expressApplication.use(Passport.initialize());
        this.expressApplication.use(Passport.session());
    }
    $afterRoutesInit() {
        this.initializeSignup();
        this.initializeJwt();
        this.initializeLogin();
    }
    /**
     * Get The JWT token for the user
     * @param user the user to encode
     * @returns The signed token
     */
    static getToken(user) {
        const body = { _id: user._id, email: user.email, admin: user.admin };
        return jwt.sign(body, secrets_1.JWT_SECRET, {
            expiresIn: 86400 * 30
        });
    }
    initializeSignup() {
        Passport
            .use("signup", new passport_local_1.Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, email, password, done) => {
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(() => {
                let user = {};
                user.email = email;
                user.password = password;
                user.fullname = req.body.fullname;
                user.username = req.body.username;
                user.codeforces = req.body.codeforces || "";
                user.country = req.body.country;
                user.uva = req.body.uva || "";
                user.livearchive = req.body.livearchive || "";
                user.admin = req.body.admin || false;
                this.signup(user)
                    .then((user) => done(null, user))
                    .catch((err) => done(err));
            });
        }));
    }
    /**
     * Create a new user and log in that newly created user
     * @param user
     * @returns {Promise<any>}
     */
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let exists;
                try {
                    exists = yield this.usersService.create(user);
                    return resolve(exists);
                }
                catch (err) {
                    exists = err;
                    return reject(exists);
                }
            }));
        });
    }
    initializeLogin() {
        Passport.use("login", new passport_local_1.Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, (req, email, password, done) => {
            process.nextTick(() => {
                this.login(email, password)
                    .then((user) => done(null, user))
                    .catch((err) => done(err));
            });
        }));
    }
    /**
     *  Login user with the given credentials if he(she) doesn't exist yet
     * @param email
     * @param password
     * @returns {Promise<InsightResponse>}
     */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                try {
                    user = yield this.usersService.findByCredential(email, password);
                    return resolve(user);
                }
                catch (err) {
                    user = err;
                    return reject(user);
                }
            }));
        });
    }
    // JWT authentication
    initializeJwt() {
        Passport.use(new passport_jwt_1.Strategy({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secrets_1.JWT_SECRET,
        }, (payload, done) => {
            process.nextTick(() => {
                this.find(payload._id)
                    .then((user) => done(null, user))
                    .catch((err) => done(err));
            });
        }));
    }
    /**
     * Find by id
     * @param id
     * @returns {Promise<InsightResponse>}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                try {
                    user = yield this.usersService.findById(id);
                    return resolve(user);
                }
                catch (err) {
                    user = err;
                    return reject(user);
                }
            }));
        });
    }
};
PassportService = PassportService_1 = __decorate([
    common_1.Service(),
    __param(2, common_1.Inject(common_1.ExpressApplication)),
    __metadata("design:paramtypes", [Users_service_1.UsersService,
        common_1.ServerSettingsService, Function])
], PassportService);
exports.PassportService = PassportService;
//# sourceMappingURL=Passport.service.js.map