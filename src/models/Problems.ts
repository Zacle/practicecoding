import { Property, Required, Allow } from "@tsed/common";
import { Model, Unique, Indexed } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";

/*
 * The model that will be used to save problems gathered
 * from different platforms in the database
*/
@Model()
export class Problems {

    @Property()
    _id?: string;

    @Property()
    @Description("ID of the problem")
    problemID?: string;

    @Property()
    @Description("Contest ID of the problem")
    contestID: number;

    @Property()
    @Description("Name of the problem")
    name: string;

    @Property()
    @Description("The plateform name")
    plateform: string;

    @Property()
    @Description("The URI of the problem")
    link: string;

    @Property()
    @Description("The level of the problem")
    difficulty: string;
}