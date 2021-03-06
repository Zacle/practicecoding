import {AuthenticatedMiddleware, EndpointInfo, EndpointMetadata, OverrideMiddleware, Req, Next, Res} from "@tsed/common";
import * as Express from "express";
import { Unauthorized } from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import { API_ERRORS } from "../../util/app.error";
import Passport from "passport";
import { HTTPStatusCodes } from "src/util/httpCode";

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware {
    constructor() {
    }

    async use(@EndpointInfo() endpoint: EndpointMetadata,
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction) {

        // retrieve Options passed to the Authenticated() decorators.
        const options = endpoint.store.get(AuthenticatedMiddleware) || {};
        $log.debug("AuthMiddleware =>", options);
        $log.debug("AuthMiddleware isAuthenticated ? =>", request.isAuthenticated());
        
        return new Promise<any>((resolve, reject) => {
            Passport.authenticate('jwt', { session: false, }, async (error, token) => {
                if (error || !token) {
                    response.status(HTTPStatusCodes.UNAUTHORIZED).json({ message: "Unauthorized "});
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
                        response.status(HTTPStatusCodes.UNAUTHORIZED).json({ message: "Unauthorized "});
                    }
                }
                console.log("OUTSIDE AUTH: ", request.user);
                resolve(next());
            })(request, response, () => {});
        });
    }
}