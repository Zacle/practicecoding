import { Service } from "@tsed/common";
import { IProblem, InsightResponse, PlateformName } from "../interfaces/InterfaceFacade";
import Log from "../Util";

/*
*   Problem class for each problem
*   Fields:
*       - id: id of the problem
*       - name: name of the problem
*       - plateform_name: name of the plateform (SPOJ, CODEFORCES, UVA, LIVEARCHIVE)
*       - link: link to the problem on the plateformName
*       - difficulty: difficulty of the problem of type Level
*/
@Service()
export class Problem implements IProblem {
    private id: number | string;
    private name: string;
    private plateform_name: PlateformName | string;
    private link: string;
    private difficulty: string = null;

    constructor() {
        Log.trace("ProblemImpl::init()");
    }

    setProblems(_id: number | string, _name: string, _plateform_name: PlateformName | string, _link: string, _stat?: string): void {
        this.id = _id;
        this.name = _name;
        this.plateform_name = _plateform_name;
        this.link = _link;
        this.difficulty = _stat;
    }

    getID(): number | string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getPlateformName(): PlateformName | string {
        return this.plateform_name;
    }

    getProblemURI(): string {
        return this.link;
    }

    getProblemStatistic(): string {
        return this.difficulty;
    }
}