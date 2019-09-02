import axios from "axios";

class Helpers {
    constructor() {

    }
    getQueryData(config: any, clientSecret: string, mode: number) {
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
    getLanguage(language: string) {
        let lang;
        if (language === 'C++') {
            lang = 'CPP';
        } else if (language === 'C') {
            lang = 'C';
        } else if (language === 'Py') {
            lang = 'PYTHON';
        } else if (language === 'C#') {
            lang = 'CSHARP';
        } else {
            lang = language.toUpperCase();
        }
        return lang;
    }

    doOperation(url: string, data: any) {
        return new Promise(async (resolve, reject) => {
            await axios.post(url, data, {
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
        });
    }

}

export class HackerEarth extends Helpers {

    protected _runURL: string;
    protected _compileURL: string;
    protected _clientSecret: string;
    protected _mode: number;

    constructor(clientSecret: string, mode?: number) {
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
    compile(config: any) {
        let data = super.getQueryData(config,this.clientSecret,this.mode);
        console.log('In HackerEarth:Compile Data sent to API is %s',JSON.stringify(data));
        return super.doOperation(this.compileURL, data);    
    }

    run(config: any) {
        let data = super.getQueryData(config,this.clientSecret,this.mode);
        console.log('In HackerEarth:Run Data sent to API is %s',JSON.stringify(data));
        return super.doOperation(this.runURL, data);
    }
}