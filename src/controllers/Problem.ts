
import {Level, PlateformName} from './Level';
import {IProblem} from './InterfaceFacade';

/*
*   Problem class for each problem
*   Fields:
*       - id: id of the problem
*       - name: name of the problem
*       - plateform_name: name of the plateform (SPOJ, CODEFORCES, UVA, LIVEARCHIVE)
*       - link: link to the problem on the plateformName
*       - difficulty: difficulty of the problem of type Level
*/

export default class Problem implements IProblem {
    private id: number | string;
    private name: string;
    private plateform_name: PlateformName;
    private link: string;
    private difficulty: Level = null;

    constructor(_id: number | string, _name: string, _plateform_name: PlateformName, _link: string, _stat?: Level) {
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

    getPlateformName(): PlateformName {
        return this.plateform_name;
    }

    getProblemURI(): string {
        return this.link;
    }

    getProblemStatistic(): Level {
        return this.difficulty;
    }
}