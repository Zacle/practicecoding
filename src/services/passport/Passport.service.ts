import {
    AfterRoutesInit,
    BeforeRoutesInit,
    ExpressApplication,
    Inject,
    ServerSettingsService,
    Service
} from "@tsed/common";
import Passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import {BadRequest, NotFound} from "ts-httpexceptions";
import { IUser, InsightResponse } from "../../interfaces/InterfaceFacade";
import { UsersService } from "../users/Users.service";
import { JWT_SECRET } from "../../util/secrets";
import jwt = require("jsonwebtoken");
import { Users } from "../../models/Users";

@Service()
export class PassportService implements BeforeRoutesInit, AfterRoutesInit {

    constructor(private usersService: UsersService,
                private serverSettings: ServerSettingsService,
                @Inject(ExpressApplication) private expressApplication: ExpressApplication) {
    
        Passport.serializeUser(PassportService.serialize);
        Passport.deserializeUser(this.deserialize.bind(this));
    }

    /**
     *
     * @param user
     * @param done
     */
    static serialize(user: any, done: any) {
        done(null, user._id);
    }

    /**
     *
     * @param id
     * @param done
     */
    public deserialize(id: string, done: any) {
        done(null, this.usersService.findById(id));
    }

    $beforeRoutesInit() {
        const options: any = this.serverSettings.get("passport") || {} as any;

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
    public static getToken(user: Users): Object {

        const body = { _id : user._id, email : user.email, admin: user.admin };

        return jwt.sign(body,
                        JWT_SECRET,
                        {
                            expiresIn: 86400 * 30
                        });
    }


    public initializeSignup() {

        Passport
            .use("signup", new LocalStrategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField: "email",
                    passwordField: "password",
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                (req, email, password, done) => {
                    // asynchronous
                    // User.findOne wont fire unless data is sent back
                    process.nextTick(() => {
                        let user: IUser = {} as any;
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
    async signup(user: IUser): Promise<InsightResponse> {

        return new Promise<InsightResponse>(async (resolve, reject) => {
            let exists: InsightResponse;

            try {
                exists = await this.usersService.create(user);

                return resolve(exists);
            }
            catch(err) {
                exists = err;
                return reject(exists);
            }
        });
    }

    public initializeLogin() {
        Passport.use("login", new LocalStrategy({
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
    async login(email: string, password: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let user: InsightResponse;
            try {
                user = await this.usersService.findByCredential(email, password);
                return resolve(user);
            }
            catch (err) {
                user = err;
                return reject(user);
            }
        });
    }

    // JWT authentication
    public initializeJwt() {
        Passport.use(new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        }, (payload: any, done: any) => {
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
    async find(id: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let user: InsightResponse;
            try {
                user = await this.usersService.findById(id);
                return resolve(user);
            }
            catch(err) {
                user = err;
                return reject(user);
            }
        });
    }
}
