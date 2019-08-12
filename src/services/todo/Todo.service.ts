import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { InsightResponse } from "../../interfaces/InterfaceFacade";
import { Users } from "../../models/Users";
import { Todos } from '../../models/Todos';

@Service()
export class TodosService {

    constructor(@Inject(Todos) private todos: MongooseModel<Todos>) {}

    /**
     * Add the problem to the todos list
     * @param data 
     * @param userID 
     */
    add(problemID: string, userID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let todo: Todos = {
                added: new Date(),
                user: userID,
                problemID: problemID
            };
            try {
                let todoExists = await this.todos.findOne({problemID: problemID}).exec();

                if (todoExists) {
                    return reject({
                        code: HTTPStatusCodes.NOT_ACCEPTABLE,
                        body: {
                            name: "This problem is already in your todo list"
                        }
                    });
                }

                let saveTodo = new this.todos(todo);
                await saveTodo.save();

                return resolve({
                    code: HTTPStatusCodes.CREATED,
                    body: {
                        result: saveTodo
                    }
                });
            }
            catch(err) {
                console.log("TODO ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't save to the todos list"
                    }
                });
            }
        });
    }

    /**
     * Remove the problem from the todos list
     * @param problemID 
     * @param userID 
     */
    remove(problemID: string, userID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let todo: Todos;
            try {
                todo = await this.todos.findOneAndRemove({problemID: problemID, user: userID}).exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: todo
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't remove the todo"
                    }
                });
            }
        });
    }

    /**
     * Get the todos list of this user
     * @param userID 
     */
    get(userID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let todo: Todos[];
            try {
                todo = await this.todos.find({user: userID}).populate("problemID").exec();
                
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: todo
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get the todos list"
                    }
                });
            }
        });
    }
}