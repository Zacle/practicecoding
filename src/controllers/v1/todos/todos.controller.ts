import {
    Authenticated,
    BodyParams,
    Controller,
    Get,
    Post,
    Req,
    Res,
    Delete,
    QueryParams
} from "@tsed/common";
import { Summary } from "@tsed/swagger";
import * as Express from "express";
import {TodosService} from '../../../services/todo/Todo.service';
import { InsightResponse } from "../../../interfaces/InterfaceFacade";


@Controller("/todos")
export class TodosCtrl {

    constructor(private todos: TodosService) {}

    @Get("/")
    @Summary("Get all todos")
    @Authenticated()
    get(@Req() request: Express.Request, @Res() response: Express.Response): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let res: InsightResponse;

            try {
                res = await this.todos.get(request.user._id);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            } catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        });
    }

    @Post("/")
    @Summary("Add a todo")
    @Authenticated()
    post(@Req() request: Express.Request, 
         @Res() response: Express.Response,
         @BodyParams("problemID") problemID: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let res: InsightResponse;


            try {
                res = await this.todos.add(problemID, request.user._id);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            } catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        });
    }

    @Delete("/")
    @Summary("Delete a todo")
    @Authenticated()
    delete(@Req() request: Express.Request, 
         @Res() response: Express.Response,
         @QueryParams("problemID") problemID: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let res: InsightResponse;

            try {
                res = await this.todos.remove(problemID, request.user._id);
                response.status(res.code);
                response.setHeader('Content-Type', 'application/json');
                response.json(res.body.result);
                resolve(res.body.result);
            } catch (err) {
                res = err;
                response.status(res.code);
                response.setHeader("Content-Type", "application/json");
                response.json(res.body.name);
                reject(res.body.name);
            }
        });
    }
}