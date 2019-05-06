export enum PlateformName {
    CODEFORCES,
    UVA,
    LIVEARCHIVE
}

export interface InsightResponse {
    code: number;
    body: InsightResponseSuccessBody | InsightResponseErrorBody; // The actual response
}

export interface InsightResponseSuccessBody {
    result: any[];
    name?: string;
}

export interface InsightResponseErrorBody {
    result?: any[];
    error?: string;

    name?: string;
}

/*
 *  Interface for every problem in all plateforms
 *  Methods:
 *      - getID(): returns the ID of the problem
 *      - getName(): returns the name or title of the problem
 *      - getPlateformName(): returns the plateform of the problem
 *      - getProblemURI(): returns the link to the problem
 *      - getProblemStatistic(): returns the difficulty of the problem
*/
export interface IProblem {
    getID(): number | string;
    getName(): string;
    getPlateformName(): PlateformName | string;
    getProblemURI(): string;
    getProblemStatistic(): string;
    setProblems(_id: number | string, _name: string, _plateform_name: PlateformName | string, _link: string, _stat?: string): void;
}

/*
 *  Interface describing the statistics of a particular user
 *  all plateforms
 *  Fields:
 *      - problemSolvedCount: number of problems solved in a particular plateform
 *      - listOfProblemsSolved: all problems the user has solved in that plateform
*/
export interface UserStatistic {
    problemSolvedCount: number;
    listOfProblemsSolved: Array<IProblem>;
}

/*
 *  Interface describing how we should query all plateforms
 *  Methods:
 *      - getProblems(key: string): returns all problems matching the key
 *      - getListOfProblems(): returns all problems in a particular plateform
 *      - getProblemsFiltered(level: Level): returns all problem of the difficulty equals to level
*/

export interface PlateformFactory {
    getProblems(key: string): Promise<InsightResponse>;
    getListOfProblems(): Promise<InsightResponse>;
    getProblemsFiltered(level: string): Promise<InsightResponse>;
}

/*
 * Interface for the returned body of each query
*/

export interface Body {
    id: number | string;
    name: string;
    palteform: string;
    link: string;
}

export enum AccessType {
    PRIVATE = 0,
    PUBLIC = 1
}

export enum ContestType {
    INDIVIDUAL = 1,
    TEAM = 2
}

/*
 * Contest interfaces
*/
export interface IContests {
    getContestID(): string;
    getStartTime(): Date;
    getDuration(): Date;
    getAccess(): AccessType;
    getContestName(): string;
    getContestOwner(): string;
    getContestType(): ContestType;
}

/*
 * Contests fields
*/
export interface IContest {
    id: string;
    startTime: Date;
    duration: Date;
    accesss: AccessType;
    contestName: string;
    contestOwner: string;
    contestType: ContestType;
}