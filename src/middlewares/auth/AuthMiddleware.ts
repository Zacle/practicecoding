import {AuthenticatedMiddleware, EndpointInfo, EndpointMetadata, OverrideMiddleware, Req, Next} from "@tsed/common";
import { Unauthorized } from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import { PassportService } from "../../services/Passport.service";
import { API_ERRORS } from "../../util/app.error";

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware {
    constructor() {
    }

    use(@EndpointInfo() endpoint: EndpointMetadata,
        @Req() request: Express.Request,
        @Next() next: Express.NextFunction) {

        // retrieve Options passed to the Authenticated() decorators.
        const options = endpoint.store.get(AuthenticatedMiddleware) || {};
        $log.debug("AuthMiddleware =>", options);
        $log.debug("AuthMiddleware isAuthenticated ? =>", request.isAuthenticated());

        PassportService.authenticate();

        if (options.role) {
            if (request.user.admin) {
                next();
            }
            else {
                throw new Unauthorized(API_ERRORS.UNAUTHORIZED.message);
            }
        }

        next();
    }
}