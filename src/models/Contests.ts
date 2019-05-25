import { Property } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Problems } from "./Problems";
import { Submissions } from "./Submissions";
import { Teams } from "./Teams";
import { Standings } from "./Standings";
import { AccessType, ContestType } from "../interfaces/InterfaceFacade";


@Model()
export class Contests {

    @Description("ContestID")
    _id?: string;

    @Property()
    @Description("Contest's start time")
    startTime: Date;

    @Property()
    @Description("Contest's end time")
    endTime: Date;

    @Property()
    @Description("Duration of the contest")
    duration: number;

    @Ref(Users)
    @Property()
    @Description("Owner(s) of the contest")
    owner: Ref<Users>[];

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

    @Ref(Users)
    @Property()
    @Description("Users registered in the contest")
    registrants?: Ref<Users>[];

    @Ref(Teams)
    @Property()
    @Description("Teams registered in the contest")
    teams?: Ref<Teams>[];

    @Ref(Submissions)
    @Property()
    @Description("Contest's submissions")
    submissions: Ref<Submissions>[];

    @Ref(Standings)
    @Property()
    @Description("Contest standing")
    standings: Ref<Standings>;
}