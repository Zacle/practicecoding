import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Users } from "../../models/Users";
import { InsightResponse } from "../../interfaces/InterfaceFacade";
import { Editor } from '../../models/Editor';
import { HACKEREARTH_SECRET } from '../../util/secrets';
const shortid = require('shortid');
let HackerEarth = require('hackerearth-node');

@Service()
export class EditorService {

    private hackerEarth: any;

    constructor(@Inject(Users) private users: MongooseModel<Users>,
                @Inject(Editor) private editors: MongooseModel<Editor>) {

        this.hackerEarth = new HackerEarth(HACKEREARTH_SECRET);

    }

    /**
     * Run the source code and save to the database
     * @param language 
     * @param theme 
     * @param input 
     * @param source 
     * @param userID 
     */
    post(language: string, theme: string, input: string, source: string, userID: string, name: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let editor: Editor;

            try {
                const config = {} as any;
                config.source = source;
                config.input = input;
                config.language = language;

                let uri = shortid.generate();

                let verifyID = await this.editors.findOne({uri: uri}).exec();
                if (verifyID) {
                    uri = shortid.generate();
                }

                editor = {
                    input: input,
                    uri: uri,
                    theme: theme,
                    language: language,
                    author: userID,
                    source: source,
                    name: name
                };
                let saveEditor = new this.editors(editor);
                await saveEditor.save();

                editor = await this.editors.findOne({uri: uri}).populate("author").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: editor
                    }
                });
            }
            catch(err) {
                console.log("POST CODE ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        name: "An error occured. Try again!"
                    }
                });
            }
        });
    }

    /**
     * Get the source code
     * @param uri 
     */
    get(uri: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let editor: Editor;

            try {
                editor = await this.editors.findOne({uri: uri}).populate("author").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: editor
                    }
                });
            }
            catch (err) {
                console.log("GET CODE ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        name: "An error occured. Try again!"
                    }
                });
            }
        });
    }

    /**
     * Run the source code and modify it to the database
     * @param language 
     * @param theme 
     * @param input 
     * @param source 
     * @param userID 
     * @param uri
     */
    put(language: string, theme: string, input: string, source: string, userID: string, uri: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let editor: Editor;

            try {    
                const config = {} as any;
                config.source = source;
                config.input = input;
                config.language = language;
                
                editor = await this.editors.findOne({uri: uri}).exec();

                const author: any = editor.author;
                if (author.toString() != userID.toString()) {
                    console.log("NOT EQUAL: ", author," and ", userID);
                    uri = shortid.generate();
                    editor = {
                        input: input,
                        uri: uri,
                        theme: theme,
                        language: language,
                        author: userID,
                        source: source,
                        name: editor.name
                    };
                }
                let saveEditor = new this.editors(editor);
                saveEditor.language = language;
                saveEditor.theme = theme;
                saveEditor.source = source;
                saveEditor.uri = uri;
                saveEditor.input = input;
                saveEditor.author = userID;
                await saveEditor.save();

                editor = await this.editors.findOne({uri: uri}).populate("author").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: editor
                    }
                });
            }
            catch(err) {
                console.log("PUT CODE ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        name: "An error occured. Try again!"
                    }
                });
            }
        });
    }

    /**
     * Delete a source code
     * @param id 
     * @param userID 
     */
    delete(id: string, userID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let editor: Editor;
            let codes: Editor[];
            let user: Users;

            try {
                user = await this.users.findById(userID).exec();
                editor = await this.editors.findByIdAndRemove(id).exec();

                codes = await this.editors.find({author: user._id}).populate("author").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: codes
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't delete this source code"
                    }
                });
            }
        });
    }

    /**
     * Get user source codes
     * @param userID 
     */
    myCodes(userID: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let codes: Editor[];
            let user: Users;

            try {
                user = await this.users.findById(userID).exec();
                console.log("USER: ", user);
                codes = await this.editors.find({author: user._id}).populate("author").exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: codes
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get user codes"
                    }
                });
            }
        });
    }
}