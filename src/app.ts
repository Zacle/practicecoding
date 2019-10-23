import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import {$log} from "ts-log-debug";

import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "morgan";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import cors from 'cors';
import { RestCtrl } from "./controllers/v1/RestCtrl";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });


// API keys and Passport configuration
import * as passportConfig from "./config/passport";
import Log from "./Util";

// Create Express server
// const app = express();
const rootDir = path.resolve(__dirname);
const mongoUrl = MONGODB_URI;

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
//   const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }


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

@ServerSettings({
  rootDir,
  mongoose : {
    url : mongoUrl,
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
export class Server extends ServerLoader {
  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public async $onMountingMiddlewares(): Promise<any> {
      this
          .use(GlobalAcceptMimesMiddleware)
          .use(bodyParser())
          .use(compression())
          .use(express())
          .use(logger('dev'))
          .use(bodyParser.json())
          .use(bodyParser.urlencoded({
              extended: true
          }))
          .use(expressValidator())
          .use(session({
            resave: true,
            saveUninitialized: true,
            secret: SESSION_SECRET,
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
          .use(cors())
          .use(flash())
          .use(lusca.xframe("SAMEORIGIN"))
          .use(lusca.xssProtection(true));


      return null;
  }


  public $onReady() {
      $log.info('Server started...');
      console.log("Server Started ", rootDir);
  }

  public $onServerInitError(err: any) {
      $log.error(err);
  }
}

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