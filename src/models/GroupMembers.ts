import { Property } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";


@Model()
export class GroupMembers {

    @Property()
    _id?: string;

    @Ref("Users")
    @Property()
    @Description("Member of the group")
    user: Ref<Users>;

    @Property()
    @Description("Admin or Participant")
    membershipType: string;

    @Property()
    @Description("Date the user joined the group")
    joined: Date;
}