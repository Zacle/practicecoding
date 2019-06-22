import { Property } from "@tsed/common";
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

    @Ref(Problems)
    @Property()
    @Description("Problems solved by the user during the contest")
    problemsSolved: Ref<Problems>[];

    @Ref(Problems)
    @Property()
    @Description("Problems not solved by the user during the contest")
    problemsUnsolved: Ref<Problems>[];

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