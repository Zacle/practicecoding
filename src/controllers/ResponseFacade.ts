import {Level, PlateformName} from './Level';

export interface InsightResponse {
    code: number;
    body: InsightResponseSuccessBody | InsightResponseErrorBody; // The actual response
}

export interface InsightResponseSuccessBody {
    result: any[] | string;
}

export interface InsightResponseErrorBody {
    error: string;
}

export interface IProblem {
    getID(): number | string;
    getName(): string;
    getPlateformName(): PlateformName;
    getProblemURI(): string;
    getProblemStatistic(problemID: string): ProblemStatistic;
}

export interface ProblemStatistic {
    solvedCount: number;
    level: Level;
}

export interface PlateformStatisticFactory {
    getUserStatistic(): Object;
}

export interface PlateformFactory {
    getProblems(key: string): InsightResponse;
    getListOfProblems(): InsightResponse;
    getProblemsFiltered(level: Level): InsightResponse;
}