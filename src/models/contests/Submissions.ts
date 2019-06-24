import { Property } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "../Users";
import { Teams } from "../Teams";

@Model()
export class Submissions {

    @Description("Submission ID")
    _id?: string;

    @Property()
    @Description("OJ Submission ID")
    submissionID: number;

    @Property()
    @Description("Submission Time")
    submissionTime: Date;

    @Property()
    problemID: string;

    @Property()
    @Description("The name of the problem")
    problemName: string;

    @Property()
    problemLink: string;

    @Property()
    @Description("Online judge of the submission")
    OJ: string;

    @Property()
    @Description("verdict of the submission")
    verdict: string;

    @Property()
    @Description("Programming language of the submission")
    language: string;

    @Ref("Users")
    @Description("Contestant submission if INDIVIDUAL contest")
    user: Ref<Users>;

    @Ref("Teams")
    @Description("Contestants submission if TEAM contest")
    team: Ref<Teams>;
}