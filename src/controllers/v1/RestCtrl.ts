import {Controller, Get, RouteService} from "@tsed/common";
import Log from "../../../src/util/logger";

@Controller("/api")
export class RestCtrl {

    constructor(private routeService: RouteService) {
        Log.info("RestCtrl called first");
    }

    @Get("/")
    public getRoutes() {
        return this.routeService.getAll();
    }
}