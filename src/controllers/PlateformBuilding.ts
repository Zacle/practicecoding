import {PlateformFactory} from './InterfaceFacade';
import {Plateform, Codeforces, Uva, Spoj, LiveArchive, AllPlateforms} from './Plateform';

/*
 *  Create a specific plateform as specified by the user
 *  from the query
*/
export default class PlateformBuilding {
    constructor() {}

    public createPlateform(typeOfPlateform: string): Plateform {
        var plateform: Plateform;

        if (typeOfPlateform == "codeforces")
            plateform = new Codeforces();

        else if (typeOfPlateform == "spoj")
            plateform = new Spoj();
        
        else if (typeOfPlateform == "uva")
            plateform = new Uva();

        else if (typeOfPlateform == "livearchive")
            plateform = new LiveArchive();
        
        else
            plateform = new AllPlateforms();

        return plateform;
    }
}