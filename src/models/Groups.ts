import { Property } from "@tsed/common";
import { Model, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Submissions } from "./contests/Submissions";
import { Contests } from "./contests/Contests";
import { Teams } from "./Teams";
import { AccessType } from "../interfaces/InterfaceFacade";

@Model()
export class Groups {

    @Property()
    _id?: string;

    @Ref("Users")
    @Property()
    @Description("Membres of the group")
    members: Ref<Users>[];

    @Property()
    @Description("Public or Private group")
    access: AccessType;

    @Property()
    @Description("What this group is all about")
    description: string;

    @Ref("Users")
    @Property()
    @Description("Admin(s) of the group")
    admin: Ref<Users>;

    @Ref(Contests)
    @Property()
    @Description("Group contests")
    contests: Ref<Contests>[];

    @Property()
    @Description("Create date of the group")
    creation: Date;

    @Property()
    @Unique()
    @Description("Group name")
    name: string;
}