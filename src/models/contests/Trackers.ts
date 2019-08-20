import { Property, PropertyType } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "../Users";
import { Problems } from "../Problems";
import { Teams } from "../Teams";
import { Contests } from "./Contests";

@Model()
export class Trackers {

    @Property()
    _id?: string;

    @Property()
    @Description("Participant's country")
    country: string;

    @Property()
    @Description("Number of problems solved")
    solvedCount: number;

    @Property()
    @Description("Penalty of user submissions")
    penalty: number;

    
    @Property()
    @PropertyType(Array)
    @Description("Problems solved by the user during the contest")
    solved: number[];

    
    @Property()
    @PropertyType(Array)
    @Description("Problems not solved by the user during the contest")
    unSolved: number[];

    @Ref("Users")
    @Property()
    @Description("Contest participant")
    contestant: Ref<Users>;

    @Ref(Teams)
    @Property()
    @Description("Team participant")
    contestants: Ref<Teams>;

    @Ref("Contests")
    @Property()
    @Description("Contest ID for this tracker")
    contestID: Ref<Contests>;
}