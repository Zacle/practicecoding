import { Property, Required } from "@tsed/common";
import { Model } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";

interface ILink {
    name: string;

    link: string;
}

/*
 * The model that will be used to get user stats on 
 * various platforms:
 *  - solvedCount: Number of problems solved by the user on a particular platform
 *  - links: list of problems solved by the user and the link to those problems
*/
@Model()
export class UserStatistic {

    @Property()
    @Required()
    @Description("Number of problems solved on Codeforces")
    codeforcesSolvedCount: number;

    @Property()
    @Required()
    @Description("Number of problems solved on Uva")
    uvaSolvedCount: number;

    @Property()
    @Required()
    @Description("Number of problems solved on Live Archive")
    livearchiveSolvedCount: number;

    @Property()
    @Required()
    @Description("List of problems solved on Codeforces")
    codeforcesLinks: ILink[];

    @Property()
    @Required()
    @Description("List of problems solved on Uva")
    uvaLinks: ILink[];

    @Property()
    @Required()
    @Description("List of problems solved on Live Archive")
    livearchiveLinks: ILink[];
}