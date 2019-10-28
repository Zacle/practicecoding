"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
require("@tsed/swagger");
const ts_log_debug_1 = require("ts-log-debug");
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const lusca_1 = __importDefault(require("lusca"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const express_validator_1 = __importDefault(require("express-validator"));
const secrets_1 = require("./util/secrets");
const cors_1 = __importDefault(require("cors"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
// Load environment variables from .env file, where API keys and passwords are configured
dotenv_1.default.config({ path: ".env.example" });
// Create Express server
// const app = express();
const rootDir = path_1.default.resolve(__dirname);
const mongoUrl = secrets_1.MONGODB_URI;
const distDir = __dirname + "/dist/";
// Express configuration
/*app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);*/
let Server = class Server extends common_1.ServerLoader {
    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares() {
        return __awaiter(this, void 0, void 0, function* () {
            this
                .use(common_1.GlobalAcceptMimesMiddleware)
                .use(body_parser_1.default())
                .use(compression_1.default())
                .use(express_1.default())
                .use(morgan_1.default('dev'))
                .use(body_parser_1.default.json())
                .use(body_parser_1.default.urlencoded({
                extended: true
            }))
                .use(express_validator_1.default())
                .use(express_session_1.default({
                resave: true,
                saveUninitialized: true,
                secret: secrets_1.SESSION_SECRET,
                cookie: {
                    path: "/",
                    httpOnly: true,
                    secure: false,
                    maxAge: null
                },
                store: new MongoStore({
                    url: mongoUrl,
                    autoReconnect: true
                })
            }))
                .use(cors_1.default())
                .use(express_flash_1.default())
                .use(lusca_1.default.xframe("SAMEORIGIN"))
                .use(lusca_1.default.xssProtection(true))
                .use(express_1.default.static(distDir));
            return null;
        });
    }
    $onReady() {
        ts_log_debug_1.$log.info('Server started...');
        console.log("Server Started ", rootDir);
    }
    $onServerInitError(err) {
        ts_log_debug_1.$log.error(err);
    }
};
Server = __decorate([
    common_1.ServerSettings({
        rootDir,
        mongoose: {
            url: mongoUrl,
            connectionOptions: {
                "useNewUrlParser": true,
                "useUnifiedTopology": true
            }
        },
        mount: {
            '/': `${rootDir}/controllers/v1/**/**.controller.{ts,js}`
        },
        componentsScan: [
            `${rootDir}/services/**/**.service.ts`,
            `${rootDir}/middlewares/**/**.ts`
        ],
        httpPort: process.env.PORT || 3001,
        httpsPort: 3443,
        acceptMimes: ['application/json'],
        swagger: {
            path: '/api-docs'
        },
        passport: {}
    })
], Server);
exports.Server = Server;
/**
 * API examples routes.
 */
/*app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
*/
/**
 * OAuth authentication routes. (Sign in)
 */
/*app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  res.redirect(req.session.returnTo || "/");
});*/
// export default app;
//# sourceMappingURL=app.js.map