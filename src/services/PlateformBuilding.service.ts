import { Service } from "@tsed/common";
import { Plateform, Codeforces, Uva, LiveArchive, AllPlateforms } from "./Plateform.service";

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
        
        if (typeOfPlateform == "codeforces")
            return this.codeforces;
        
        else if (typeOfPlateform == "uva")
            return this.uva;

        else if (typeOfPlateform == "livearchive")
            return this.livearchive;
        
        else
            return this.all;

    }
}