import { IProblem, PlateformFactory, ProblemStatistic, UserStatistic } from "./InterfaceFacade";
import { InsightResponse } from "./InterfaceFacade";
import { Level, PlateformName } from "./Level";

/*
 *  Define the plateform superclass that will serve as a base
 *  class for all plateform
 *  Fields:
 *      - plateformFactory: name of the plateform to search for the query
 *      - listOfProblems: list of problems matching the current query
 *      - userStat: statistic of the user on a particular plateform
*/

export abstract class Plateform {
    private plateformFactory: PlateformFactory;
    private listOfProblems: Array<IProblem>;
    private userStat: UserStatistic;

    constructor() {}

    abstract getPlateform(): PlateformName;

    abstract getUserStatistic(): Promise<InsightResponse>;

}

export class Codeforces extends Plateform implements PlateformFactory {    
    saveListOfProblems(problems: Promise<InsightResponse>): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): PlateformName {
        return null;
    }

    constructor() {
        super();
    }

    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
}

export class Spoj extends Plateform implements PlateformFactory {
    
    saveListOfProblems(problems: Promise<InsightResponse>): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): PlateformName {
        return null;
    }

    constructor() {
        super();
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
}

export class Uva extends Plateform implements PlateformFactory {
    saveListOfProblems(problems: Promise<InsightResponse>): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): PlateformName {
        return null;
    }

    constructor() {
        super();
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getListOfProblems(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
}

export class LiveArchive extends Plateform implements PlateformFactory {
    
    saveListOfProblems(problems: Promise<InsightResponse>): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): PlateformName {
        return null;
    }

    constructor() {
        super();
    }

    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});;
    }
    
    getListOfProblems(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
}

/*
 *  If the user didn't specify any palteform in the query
 *  use all plateforms at the same time to search for a problem
 *  matching the query
*/

export class AllPlateforms extends Plateform implements PlateformFactory {
    
    saveListOfProblems(problems: Promise<InsightResponse>): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getPlateform(): PlateformName {
        return null
    }

    constructor() {
        super();
    }
    
    getProblems(key: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});;
    }
    
    getListOfProblems(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }
    
    getProblemsFiltered(level: Level): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    getUserStatistic(): Promise<InsightResponse> {
        return null;
    }
}