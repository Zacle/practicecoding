import { Property, IgnoreProperty, PropertyType } from "@tsed/common";
import { Model, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Submissions } from "./contests/Submissions";
import { Contests } from "./contests/Contests";
import { Teams } from "./Teams";
import { AccessType } from "../interfaces/InterfaceFacade";

@Model()
export class Invitations {

    @IgnoreProperty()
    _id?: string;

    @Property()
    @Description("ID of the user who sent the invitation")
    senderID: string;

    @Property()
    @Description("Username of the user who sent the invitation")
    senderUsername: string;

    @PropertyType(Date)
    @Description("Time that the invitation was sent")
    sentAt: Date;

    @Property()
    @Description("receiver read or not the invitation")
    read: boolean;

    @Property()
    @Description("link to the invitation place")
    link: string;

    @Property()
    @Description("User accepted or declined the invitation")
    expired: boolean;

    @Property()
    @Description("username of the receiver")
    receiverUsername: string;

    @Property()
    @Description("ID of the receiver")
    receiverID: string;
}