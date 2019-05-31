import { Property } from "@tsed/common";
import { Model, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "../Users";
import { Problems } from "../Problems";
import { Submissions } from "../contests/Submissions";
import { Teams } from "../Teams";
import { Standings } from "../contests/Standings";
import { AccessType, ContestType } from "../../interfaces/InterfaceFacade";


@Model()
export class Contests {

    @Description("ContestID")
    _id?: string;

    @Property()
    @Unique()
    @Description("Contest name")
    name: string;

    @Property()
    @Description("Contest's start time")
    startTime: Date;

    @Property()
    @Description("Contest's end time")
    endTime: Date;

    @Property()
    @Description("Contest's start date")
    startDate: Date;

    @Property()
    @Description("Contest's end date")
    endDate: Date;

    @Property()
    @Description("Duration of the contest")
    duration: number;

    @Ref(Users)
    @Property()
    @Description("Owner of the contest")
    owner: Ref<Users>;

    @Property()
    @Description("Private or public contest")
    access: AccessType;

    @Property()
    @Description("Individual or team contest")
    type: ContestType;

    @Ref(Problems)
    @Property()
    @Description("List of problems")
    problems: Ref<Problems>[];

    @Ref(Teams)
    @Property()
    @Description("Teams registered in the contest")
    teams: Ref<Teams>[];

    @Ref(Submissions)
    @Property()
    @Description("Contest's submissions")
    submissions: Ref<Submissions>[];

    @Ref(Standings)
    @Property()
    @Description("Contest standing")
    standings: Ref<Standings>;
}