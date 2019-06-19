import { Service } from "@tsed/common";
import { Plateform, Codeforces, Uva, LiveArchive, AllPlateforms } from "../plateform/Plateform.service";

/*
 *  Create a specific plateform as specified by the user
 *  from the query
*/
@Service()
export default class PlateformBuilding {
    constructor(private codeforces: Codeforces,
                private livearchive: LiveArchive,
                private uva: Uva,
                private all: AllPlateforms) {}

    public createPlateform(typeOfPlateform: string): Plateform {
        
        if (typeOfPlateform == "Codeforces")
            return this.codeforces;
        
        else if (typeOfPlateform == "Uva")
            return this.uva;

        else if (typeOfPlateform == "Live Archive")
            return this.livearchive;
        
        else
            return this.all;

    }
}