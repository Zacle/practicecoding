import { Property } from "@tsed/common";
import { Model, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Contests } from "./contests/Contests";
import { AccessType } from "../interfaces/InterfaceFacade";
import { GroupMembers } from "./GroupMembers";

@Model()
export class Groups {

    @Property()
    _id?: string;

    @Ref("GroupMembers")
    @Property()
    @Description("Members of the group")
    members: Ref<GroupMembers>[];

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