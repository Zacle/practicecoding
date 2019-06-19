import { Property } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Trackers } from "./Trackers";
import { Contests } from "./Contests";

@Model()
export class Standings {

    @Property()
    _id?: string;

    @Ref(Trackers)
    @Property()
    @Description("Track user progress druring the contest")
    trackers: Ref<Trackers>[];

    @Ref("Contests")
    @Property()
    @Description("Contest ID for this standing")
    contestID: Ref<Contests>;
}