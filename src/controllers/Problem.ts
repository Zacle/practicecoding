
import {Level, PlateformName} from './Level';
import {IProblem, ProblemStatistic} from './ResponseFacade';

/*
*   Problem class for each problem
*   Fields:
*       - id: id of the problem
*       - name: name of the problem
*       - plateform_name: name of the plateform (SPOJ, CODEFORCES, UVA, LIVEARCHIVE)
*       - link: link to the problem on the plateformName
*       - statisctic: statistics associated to this problem (solved count, level)
*/

export default class Problem implements IProblem {
    private id: number | string;
    private name: string;
    private plateform_name: PlateformName;
    private link: string;
    private statistic: ProblemStatistic

    constructor(_id: number | string, _name: string, _plateform_name: PlateformName, _link: string, _stat: ProblemStatistic) {
        this.id = _id;
        this.name = _name;
        this.plateform_name = _plateform_name;
        this.link = _link;
        this.statistic = _stat;
    }

    getID(): number | string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getPlateformName(): PlateformName {
        return this.plateform_name;
    }

    getProblemURI(): string {
        return this.link;
    }

    getProblemStatistic(): ProblemStatistic {
        return this.statistic;
    }
}