import { Property } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Teams } from "./Teams";

@Model()
export class Submissions {

    @Description("Submission ID")
    _id?: string;

    @Property()
    @Description("Submission Time")
    submissionTime: Date;

    @Property()
    @Description("The name of the problem and its link")
    problem: string;

    @Property()
    @Description("Online judge of the submission")
    OJ: string;

    @Property()
    @Description("verdict of the submission")
    verdict: string;

    @Property()
    @Description("Programming language of the submission")
    language: string;

    @Ref(Users)
    @Description("Contestant submission if INDIVIDUAL contest")
    contestant?: Ref<Users>;

    @Ref(Teams)
    @Description("Team submission if TEAM contest")
    team?: Ref<Teams>;

    @Ref(Users)
    @Description("Contestants submission if TEAM contest")
    contestants?: Ref<Users>[];
}