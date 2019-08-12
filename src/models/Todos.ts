import { Property } from "@tsed/common";
import { Model, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from "./Users";
import { Problems } from './Problems';

@Model()
export class Todos {

    @Property()
    _id?: string;

    @Property()
    @Description("Date that this was added")
    added: Date;

    @Ref("Users")
    @Property()
    @Description("The user that added this todo")
    user: Ref<Users>;

    @Ref(Problems)
    @Property()
    @Description("Problem to solve")
    problemID: Ref<Problems>;
}