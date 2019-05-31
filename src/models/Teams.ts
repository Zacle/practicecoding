import { Property } from "@tsed/common";
import { Model, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Contests } from "./contests/Contests";
import { Submissions} from "./contests/Submissions";

@Model()
export class Teams {

    @Property()
    _id?: string;

    @Ref(Contests)
    @Property()
    @Description("Contests the team has participated")
    contests: Ref<Contests>[];

    @Ref(Submissions)
    @Property()
    @Description("Team's submissions")
    submissions: Ref<Submissions>[];

    @Ref(Users)
    @Property()
    @Description("Admin of the team")
    admin: Ref<Users>;

    @Property()
    @Description("Creation date of the team")
    creation: Date;

    @Property()
    @Unique()
    @Description("Team's name")
    name: string;

    @Ref(Users)
    @Property()
    @Description("Members of the teams")
    members: Ref<Users>[];
}