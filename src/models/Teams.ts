import { Property, PropertyType, IgnoreProperty } from "@tsed/common";
import { Model, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Contests } from "./contests/Contests";

@Model()
export class Teams {

    @Property()
    _id?: string;

    @Ref(Contests)
    @Description("Contests the team has participated")
    contests: Ref<Contests>[];

    @Ref("Users")
    @Property()
    @Description("Admin of the team")
    admin: Ref<Users>;

    @PropertyType(Date)
    @Description("Creation date of the team")
    creation: Date;

    @Property()
    @Unique()
    @Description("Team's name")
    name: string;

    @Ref("Users")
    @Description("Members of the teams")
    members: Ref<Users>[];
}