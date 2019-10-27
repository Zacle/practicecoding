"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Helpers {
    constructor() {
    }
    getQueryData(config, clientSecret, mode) {
        const obj = {
            client_secret: clientSecret,
            async: mode,
            source: config.source,
            lang: this.getLanguage(config.language),
            input: config.input,
            time_limit: config.time_limit || 5,
            memory_limit: config.memory_limit || 262144
        };
        return obj;
    }
    getLanguage(language) {
        let lang;
        if (language === 'C++') {
            lang = 'CPP';
        }
        else if (language === 'C') {
            lang = 'C';
        }
        else if (language === 'Py') {
            lang = 'PYTHON';
        }
        else if (language === 'C#') {
            lang = 'CSHARP';
        }
        else {
            lang = language.toUpperCase();
        }
        return lang;
    }
    doOperation(url, data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.post(url, data, {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'Content-Encoding': 'gzip'
                }
            })
                .then(result => resolve(result.data))
                .catch(err => {
                console.log("HACKEREARTH ERROR: ", err);
                reject(err);
            });
        }));
    }
}
class HackerEarth extends Helpers {
    constructor(clientSecret, mode) {
        super();
        this._runURL = 'https://api.hackerearth.com/v3/code/run/';
        this._compileURL = 'https://api.hackerearth.com/v3/code/compile/';
        this._clientSecret = clientSecret;
        this._mode = mode || 0;
    }
    get runURL() {
        return this._runURL;
    }
    get compileURL() {
        return this._compileURL;
    }
    get clientSecret() {
        return this._clientSecret;
    }
    get mode() {
        return this._mode;
    }
    compile(config) {
        let data = super.getQueryData(config, this.clientSecret, this.mode);
        console.log('In HackerEarth:Compile Data sent to API is %s', JSON.stringify(data));
        return super.doOperation(this.compileURL, data);
    }
    run(config) {
        let data = super.getQueryData(config, this.clientSecret, this.mode);
        console.log('In HackerEarth:Run Data sent to API is %s', JSON.stringify(data));
        return super.doOperation(this.runURL, data);
    }
}
exports.HackerEarth = HackerEarth;
//# sourceMappingURL=hackerEarth.js.map