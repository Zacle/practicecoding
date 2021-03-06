import { Property, Required, Email, PropertyType, Default } from "@tsed/common";
import { Model, Unique, PreHook, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Teams } from "./Teams";
import { Groups } from "./Groups";
import { Contests } from "./contests/Contests";


@Model()
export class Users {

    @Description("ID of each user")
    _id?: string;

    @Property()
    @Email()
    @Description("Email of the user")
    email: string;

    @Property()
    @Required()
    @Description("Password of the user")
    password: string;

    @Property()
    @Description("Codeforces Handle")
    joined?: Date = new Date();

    @Property()
    @Description("Wheter the account is activated or not")
    activated: boolean;

    @Property()
    @Description("Token to validate email")
    @Default("")
    emailValidationToken?: string;

    @Property()
    @Description("Reset token for the password")
    @Default("")
    passwordResetToken?: string;

    @Property()
    @Description("The Expiration time of the password token sent")
    passwordResetExpires?: number;

    @Property()
    @Description("Reset token for the email")
    @Default("")
    emailResetToken?: string;

    @Property()                                                                                                                 
    @Description("The Expiration time of the email token sent")
    emailResetExpires?: number;

    @Property()
    @Description("Facebook OAuth for login")
    @Default("")
    facebook?: string;

    @Property()
    @Description("Google OAuth for login")
    @Default("")
    google?: string;

    @Property()
    @Description("GitHub OAuth for login")
    @Default("")
    github?: string;

    @Property()
    @Description("Twitter OAuth for login")
    @Default("")
    twitter?: string;

    @Property()
    @Description("Codeforces Handle")
    codeforces: string;

    @Property()
    @Description("Uva Handle")
    uva: string;

    @Property()
    @Description("Live Archive Handle")
    livearchive: string;

    @Property()
    @Required()
    @Description("User Full name")
    fullname: string;

    @Property()
    @Description("User name that will be displayed")
    username: string;

    @Property()
    @Required()
    @Description("User Country")
    country: string;

    @Property()
    @Default(false)
    @Description("Whether or not the user is an admin")
    admin: Boolean;

    @Ref(Teams)
    @Description("Teams the user belongs to")
    teams: Ref<Teams>[];

    @Ref(Groups)
    @Description("Groups the user belongs to")
    groups: Ref<Groups>[];

    @Ref(Contests)
    @Description("Contests attended by the user")
    contests: Ref<Contests>[];
}