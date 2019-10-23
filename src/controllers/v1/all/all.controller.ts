import {
    Controller,
    Get,
    Req,
    Res
} from "@tsed/common";
import * as Express from "express";
import { Summary } from "@tsed/swagger";
import path from "path";


@Controller("*")
export class AllCtrl {

    @Get("/")
    @Summary("Default endpoint")
    get(@Res() response: Express.Response, @Req() request: Express.Request) {
        response.sendFile(path.resolve(__dirname, "../../../../client/build/index.js"));
    }
}