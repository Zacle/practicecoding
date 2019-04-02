import {IProblem, PlateformFactory, ProblemStatistic, UserStatistic} from './InterfaceFacade';
import {InsightResponse, InsightResponseSuccessBody, InsightResponseErrorBody} from './InterfaceFacade';
import {Level, PlateformName} from './Level';

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
    private listOfProblems: Promise<InsightResponse>;
    private userStat: UserStatistic;

    constructor() {}

    public getPlateform(): PlateformFactory {
        return null;
    }

    abstract getUserStatistic(): UserStatistic;

}

export class Codeforces extends Plateform implements PlateformFactory {

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

    getUserStatistic(): UserStatistic {
        return null;
    }
}

export class Spoj extends Plateform implements PlateformFactory {

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

    getUserStatistic(): UserStatistic {
        return null;
    }
}

export class Uva extends Plateform implements PlateformFactory {

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

    getUserStatistic(): UserStatistic {
        return null;
    }
}

export class LiveArchive extends Plateform implements PlateformFactory {

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

    getUserStatistic(): UserStatistic {
        return null;
    }
}

/*
 *  If the user didn't specified any palteform in the query
 *  use all plateforms at the same time to search for a problem
 *  matching the query
*/

export class AllPlateforms extends Plateform implements PlateformFactory {

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

    getUserStatistic(): UserStatistic {
        return null;
    }
}