import {Controller, Get, RouteService} from "@tsed/common";
import Log from "src/Util";

@Controller("/")
export class RestCtrl {

    constructor(private routeService: RouteService) {
        Log.info("RestCtrl called first");
    }

    @Get("/")
    public getRoutes() {
        return this.routeService.getAll();
    }
}