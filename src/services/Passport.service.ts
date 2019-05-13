import {
    AfterRoutesInit,
    BeforeRoutesInit,
    ExpressApplication,
    Inject,
    ServerSettingsService,
    Service
} from "@tsed/common";
import * as Passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStategy, ExtractJwt } from "passport-jwt";
import {BadRequest, NotFound} from "ts-httpexceptions";
import { IUser, InsightResponse } from "../interfaces/InterfaceFacade";
import { UsersService } from "./Users.service";
import { API_ERRORS } from "../util/app.error";
import { JWT_SECRET } from "../util/secrets";
import jwt = require("jsonwebtoken");
import { Users } from "../models/Users";

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
        const {userProperty, pauseStream} = options; // options stored with ServerSettings

        this.expressApplication.use(Passport.initialize({userProperty}));
        this.expressApplication.use(Passport.session({pauseStream}));
    }

    $afterRoutesInit() {
        this.initializeSignup();
        this.initializeLogin();
        this.initializeJwt();
    }

    /**
     * Get The JWT token for the user
     * @param user 
     */
    public static getToken(user: Users): Object {
        return jwt.sign(user, 
                        JWT_SECRET,
                        {
                            expiresIn: "7d"
                        });
    }

    /**
     * Authenticate user using JWT
     */
    public static authenticate() {
        Passport.authenticate("jwt", { session: false });
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
                        let user: IUser;
                        user.email = email;
                        user.password = password;
                        user.fullname = req.body.fullname;
                        user.username = req.body.username;
                        user.codeforces = req.body.codeforces || "";
                        user.country = req.body.country;
                        user.uva = req.body.uva || "";
                        user.livearchive = req.body.livearchive || "";
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

        let exists: InsightResponse;

        try {
            exists = await this.usersService.findByEmail(user.email);
            if (exists.code == API_ERRORS.USER_ALREADY_EXISTS.code) { // User exists
                throw new BadRequest("Email is already registered");
            }
        }
        catch(err) {
            throw new BadRequest(API_ERRORS.GENERAL_ERROR.message);
        }
        

        // Create new User
        return await this.usersService.create(user);
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
        let user: InsightResponse;
        try {
            user = await this.usersService.findByCredential(email, password);

            if (user.code == API_ERRORS.USER_NOT_FOUND.code) {
                throw new NotFound("User not found");
            }
        }
        catch (err) {
            throw new BadRequest(API_ERRORS.GENERAL_ERROR.message);
        }

        return user;
    }

    // JWT authentication
    public initializeJwt() {
        Passport.use("jwt", new JwtStategy({
            passReqToCallback: true, // allows us to pass back the entire request to the callback,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET
        }, (req: any, payload: any, done: any) => {
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
        let user: InsightResponse;
        
        try {
            user = await this.usersService.findById(id);
            if (user.code == API_ERRORS.USER_NOT_FOUND.code) {
                throw new NotFound("User not found");
            }
        }
        catch(err) {
            throw new BadRequest(API_ERRORS.GENERAL_ERROR.message);
        }

        return user;
    }
}