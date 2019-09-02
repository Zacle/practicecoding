import { Property, Required, PropertyType, Default, Any } from "@tsed/common";
import { Model, Unique, PreHook, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Users } from './Users';

@Model()
export class Editor {

    @Property()
    @Default("")
    @Description("Input to test the source code")
    input?: string;

    @Any()
    @Description("Ouput of the source code")
    output?: any;

    @Property()
    @Description("Name of the source code")
    name: string;

    @Property()
    @Unique()
    @Description("Unique URI to access the source code")
    uri: string;

    @Property()
    @Description("Theme the used to write the code")
    theme: string;

    @Property()
    @Description("Source code")
    source: string;

    @Property()
    @Description("Language of the source code")
    language: string;

    @Ref("Users")
    @Property()
    @Description("Author of the source code")
    author: Ref<Users>;
}