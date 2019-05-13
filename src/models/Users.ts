import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import { Property, Required, Email, PropertyType, Default } from "@tsed/common";
import { Model, Unique, PreHook } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";


@Model()
@PreHook("save", function save(next: any) {
    const user = this;
    if (!user.isModified("password")) { return next(); }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
})
export class Users {

    @Property()
    @Email()
    @Required()
    @Unique()
    @Description("Email of the user")
    email: String;

    @Property()
    @Required()
    @Description("Password of the user")
    password: String;

    @Property()
    @Description("Reset token for the password")
    passwordResetToken: String;

    @Property()
    @PropertyType(Date)
    @Description("The Expiration time of the password token sent")
    passwordResetExpires: Date;

    @Property()
    @Description("Reset token for the email")
    emailResetToken: String;

    @Property()
    @PropertyType(Date)
    @Description("The Expiration time of the email token sent")
    emailResetExpires: Date;

    @Property()
    @Description("Facebook OAuth for login")
    facebook: String;

    @Property()
    @Description("Google OAuth for login")
    google: String;

    @Property()
    @Description("GitHub OAuth for login")
    github: String;

    @Property()
    @Description("Twitter OAuth for login")
    twitter: String;

    @Property()
    @Description("Codeforces Handle")
    codeforces: String;

    @Property()
    @Description("Uva Handle")
    uva: String;

    @Property()
    @Description("Live Archive Handle")
    livearchive: String;

    @Property()
    @Required()
    @Description("User Full name")
    fullname: String;

    @Property()
    @Required()
    @Unique()
    @Description("User name that will be displayed")
    username: String;

    @Property()
    @Required()
    @Description("User Country")
    country: String;

    @Property()
    @Default(false)
    @Description("Whether or not the user is an admin")
    admin: Boolean;
}