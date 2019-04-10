import { IProblem, PlateformFactory, UserStatistic } from "./InterfaceFacade";
import { InsightResponse } from "./InterfaceFacade";
import { Level, PlateformName } from "./Level";
import Log from "../Util";
import { Saver } from './Problem';

/*
 *  Define the plateform superclass that will serve as a base
 *  class for all plateform
 *  Fields:
 *      - plateformFactory: name of the plateform to search for the query
 *      - listOfProblems: list of problems matching the current query
 *      - userStat: statistic of the user on a particular plateform
*/

export abstract class Plateform implements PlateformFactory {
    
    private plateformFactory: PlateformFactory;
    private listOfProblems: Array<IProblem> = [];
    private userStat: UserStatistic;
    private plateformMane: PlateformName;

    constructor() {
        Log.trace("Plateform::init()");
    }

    abstract getPlateform(): Promise<InsightResponse>;

    abstract getUserStatistic(): Promise<InsightResponse>;

    abstract getProblems(key: string): Promise<InsightResponse>;

    abstract getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse>;

    abstract getProblemsFiltered(level: Level): Promise<InsightResponse>;

}

export class Codeforces extends Plateform {    

    constructor() {
        super();
        Log.trace("Codeforces::init()");
    }

    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});;
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});;
    }
}

export class Spoj extends Plateform {

    constructor() {
        super();
        Log.trace("Spoj::init()");
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

export class Uva extends Plateform {

    constructor() {
        super();
        Log.trace("Uva::init()");
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

export class LiveArchive extends Plateform {

    constructor() {
        super();
        Log.trace("LiveArchive::init()");
    }

    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});;
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}

/*
 *  If the user didn't specify any palteform in the query
 *  use all plateforms at the same time to search for a problem
 *  matching the query
*/

export class AllPlateforms extends Plateform {

    constructor() {
        super();
        Log.trace("AllPlateforms::init()");
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});;
    }
    
    getListOfProblems(content: string, plateform: PlateformName): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
    
    getPlateform(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
}