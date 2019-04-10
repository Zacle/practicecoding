import { Level, PlateformName } from "./Level";

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
    getProblemStatistic(): Level;
}

export interface ProblemStatistic {
    solvedCount: number;
    level: Level;
}

export interface UserStatistic {
    problemSolvedCount: number;
    listOfProblemsSolved: Array<IProblem>;
}

export interface PlateformFactory {
    getProblems(key: string): Promise<InsightResponse>;
    getListOfProblems(): Promise<InsightResponse>;
    getProblemsFiltered(level: Level): Promise<InsightResponse>;
    saveListOfProblems(problems: Promise<InsightResponse>): Promise<InsightResponse>;
}