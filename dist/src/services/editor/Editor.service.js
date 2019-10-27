"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Users_1 = require("../../models/Users");
const Editor_1 = require("../../models/Editor");
const secrets_1 = require("../../util/secrets");
const shortid = require('shortid');
let HackerEarth = require('hackerearth-node');
let EditorService = class EditorService {
    constructor(users, editors) {
        this.users = users;
        this.editors = editors;
        this.hackerEarth = new HackerEarth(secrets_1.HACKEREARTH_SECRET);
    }
    /**
     * Run the source code and save to the database
     * @param language
     * @param theme
     * @param input
     * @param source
     * @param userID
     */
    post(language, theme, input, source, userID, name) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let editor;
            try {
                const config = {};
                config.source = source;
                config.input = input;
                config.language = language;
                let uri = shortid.generate();
                let verifyID = yield this.editors.findOne({ uri: uri }).exec();
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
                yield saveEditor.save();
                editor = yield this.editors.findOne({ uri: uri }).populate("author").exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: editor
                    }
                });
            }
            catch (err) {
                console.log("POST CODE ERROR: ", err);
                return reject({
                    code: 500 /* INTERNAL_SERVER_ERROR */,
                    body: {
                        name: "An error occured. Try again!"
                    }
                });
            }
        }));
    }
    /**
     * Get the source code
     * @param uri
     */
    get(uri) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let editor;
            try {
                editor = yield this.editors.findOne({ uri: uri }).populate("author").exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: editor
                    }
                });
            }
            catch (err) {
                console.log("GET CODE ERROR: ", err);
                return reject({
                    code: 500 /* INTERNAL_SERVER_ERROR */,
                    body: {
                        name: "An error occured. Try again!"
                    }
                });
            }
        }));
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
    put(language, theme, input, source, userID, uri) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let editor;
            try {
                const config = {};
                config.source = source;
                config.input = input;
                config.language = language;
                editor = yield this.editors.findOne({ uri: uri }).exec();
                const author = editor.author;
                if (author.toString() != userID.toString()) {
                    console.log("NOT EQUAL: ", author, " and ", userID);
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
                yield saveEditor.save();
                editor = yield this.editors.findOne({ uri: uri }).populate("author").exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: editor
                    }
                });
            }
            catch (err) {
                console.log("PUT CODE ERROR: ", err);
                return reject({
                    code: 500 /* INTERNAL_SERVER_ERROR */,
                    body: {
                        name: "An error occured. Try again!"
                    }
                });
            }
        }));
    }
    /**
     * Delete a source code
     * @param id
     * @param userID
     */
    delete(id, userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let editor;
            let codes;
            let user;
            try {
                user = yield this.users.findById(userID).exec();
                editor = yield this.editors.findByIdAndRemove(id).exec();
                codes = yield this.editors.find({ author: user._id }).populate("author").exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: codes
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't delete this source code"
                    }
                });
            }
        }));
    }
    /**
     * Get user source codes
     * @param userID
     */
    myCodes(userID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let codes;
            let user;
            try {
                user = yield this.users.findById(userID).exec();
                console.log("USER: ", user);
                codes = yield this.editors.find({ author: user._id }).populate("author").exec();
                return resolve({
                    code: 200 /* OK */,
                    body: {
                        result: codes
                    }
                });
            }
            catch (err) {
                return reject({
                    code: 400 /* BAD_REQUEST */,
                    body: {
                        name: "Couldn't get user codes"
                    }
                });
            }
        }));
    }
};
EditorService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Users_1.Users)),
    __param(1, common_1.Inject(Editor_1.Editor)),
    __metadata("design:paramtypes", [Object, Object])
], EditorService);
exports.EditorService = EditorService;
//# sourceMappingURL=Editor.service.js.map