import { Service } from "@tsed/common";
import { ContestsService } from "./Contests.service";
import { IndividualContestService } from "./IndividualContests.service";
import { TeamContestService } from "./TeamContests.service";
import { ContestType } from "../../interfaces/InterfaceFacade";

@Service()
export default class ContestBuilderService {

    constructor(private individual: IndividualContestService,
                private team: TeamContestService) {}

    /**
     * Create a contest type: INDIVIDUAL OR TEAM
     * @param type 
     */
    public createContest(type: ContestType): ContestsService {

        if (type == ContestType.TEAM) {
            return this.team;
        }
        else {
            return this.individual;
        }
    }
}