import {
    Authenticated,
    BodyParams,
    Controller,
    Get,
    PathParams,
    QueryParams,
    Post,
    Req,
    Res,
    Required,
    MergeParams,
    Delete,
    Put
} from "@tsed/common";
import * as Express from "express";
import { InsightResponse } from "../../../interfaces/InterfaceFacade";
import { Summary } from "@tsed/swagger";
import { EditorService } from "../../../services/editor/Editor.service";

@Controller("/api/editor")
export class EditorCtrl {

    constructor(private editorService: EditorService) {}

    @Post("/")
    @Summary("Compile and Run the source code")
    @Authenticated()
    post(@BodyParams("language") language: string,
         @BodyParams("theme") theme: string,
         @BodyParams("input") input: string,
         @BodyParams("source") source: string,
         @BodyParams("name") name: string,
         @Req() request: Express.Request,
         @Res() response: Express.Response) {
        return new Promise<any>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.editorService.post(language, theme, input, source, request.user._id, name);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Get("/my")
    @Summary("Get user source codes")
    @Authenticated()
    myCodes(@Res() response: Express.Response, @Req() request: Express.Request) {
        return new Promise<any>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.editorService.myCodes(request.user._id);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Get("/:uri")
    @Summary("Get the source code")
    get(@PathParams("uri") uri: string,
        @Res() response: Express.Response) {
        return new Promise<any>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.editorService.get(uri);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Put("/:uri")
    @Summary("Modify, Compile and Run the source code")
    @Authenticated()
    put(@BodyParams("language") language: string,
         @BodyParams("theme") theme: string,
         @BodyParams("input") input: string,
         @BodyParams("source") source: string,
         @PathParams("uri") uri: string,
         @Req() request: Express.Request,
         @Res() response: Express.Response) {
        return new Promise<any>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.editorService.put(language, theme, input, source, request.user._id, uri);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }

    @Delete("/:id")
    @Summary("Delete this source code")
    @Authenticated()
    delete(@Res() response: Express.Response, @PathParams("id") id: string, @Req() request: Express.Request) {
        return new Promise<any>(async (resolve, reject) => {
            let result: InsightResponse;

            try {
                result = await this.editorService.delete(id, request.user._id);
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.result);
                resolve(result.body.result);
            }
            catch(err) {
                result = err;
                response.status(result.code);
                response.setHeader("Content-Type", "application/json");
                response.json(result.body.name);
                reject(result.body.name);
            }
        });
    }
}