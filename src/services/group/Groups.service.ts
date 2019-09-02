import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { Users } from "../../models/Users";
import { Groups } from "../../models/Groups";
import { InsightResponse, AccessType } from "../../interfaces/InterfaceFacade";
import { GroupMembers } from "../../models/GroupMembers";

@Service()
export class GroupsService {

    constructor(@Inject(Groups) private groups: MongooseModel<Groups>,
                @Inject(Users) private users: MongooseModel<Users>,
                @Inject(GroupMembers) private groupMembers: MongooseModel<GroupMembers>) {}

    /**
     * Create a new group and a user as the admin
     * @param name name of the group
     * @param access access type: PUBLIC OR PRIVATE
     * @param description description of the group
     * @param userID group owner
     */
    async createGroup(name: string, userID: string, access: string, description: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let accessType: AccessType;
            if (access == "PUBLIC") {
                accessType = AccessType.PUBLIC;
            }
            else {
                accessType = AccessType.PRIVATE;
            }
            let group: Groups = {
                name: name,
                admin: userID,
                creation: new Date(),
                contests: [],
                members: [],
                access: accessType,
                description: description
            };
    
            let result: Groups;
            let total: number;
    
            try {
                total = await this.groups.find({}).count().exec();
                group.name = (total + 1) + " - " + name;
                let exist: boolean = await this.exists(group.name);

                if (exist) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "Group name already exists"
                        }
                    });
                }
                await this.groups.create(group);
    
                result = await this.groups.findOne({name: group.name}, "-__v").exec();
    
                if (result) {
                    let ans: InsightResponse;
                    ans = await this.addGroupMember(result._id, userID, "Admin");
                    return resolve(ans);
                }
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't create a group"
                    }
                });
            }
            catch (err) {
                console.log("CREATE ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't create a group"
                    }
                });
            }
        });
    }

    /**
     * Verify if a group with this name already exist
     * @param name 
     */
    private async exists(name: string): Promise<boolean> {

        let result: any;

        return new Promise<boolean>(async (resolve, reject) => {
            try {
                result = await this.groups.findOne({name: name}).exec();

                if (result) {
                    return resolve(true);
                }

                return resolve(false);
            }
            catch(err) {
                return reject(err);
            }
        });
    }

    /**
     * Return all groups that contain the user
     * @param username
     */
    async getGroups(username: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let group: Users;

            try {
                group = await this.users.findOne({username: username}, "-__v")
                                        .populate({
                                            path: "groups",
                                            populate: {
                                                path: "admin"
                                            }
                                        })
                                        .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: group.groups
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Return all groups of the web app
     */
    async getAllGroups(): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let group: Groups[];

            try {
                group = await this.groups.find({ access: AccessType.PUBLIC }, "-__v")
                                        .populate("admin")
                                        .exec();
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: group
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Delete a group identified by id
     * @param id the group id to delete
     * @requires group's admin authorization
     */
    async deleteGroup(id: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let group: any;

            try {
                const admin: boolean = await this.isAdmin(id, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to delete this group"
                        }
                    });
                }
                group = await this.groups.findById(id, "-__v").exec();

                if (group) {
                    group = await this.deleteUserGroup(group);
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: group
                        }
                    });
                }
                return reject({
                    code: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Group id not found"
                    }
                }); 
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * For each user in the group remove him(her) from the group
     * @param group 
     */
    private async deleteUserGroup(group: Groups): Promise<Groups> {
        return new Promise<Groups>(async (resolve, reject) => {
            let user: Users;
            
            let IDs: any[] = [...group.members];
            try {
                for (let i = 0; i < IDs.length; i++) {
                    const id = IDs[i];
                    user = await this.users.findByIdAndUpdate(
                        id,
                        {$pull: {groups: {_id: id}}}
                    ).exec();
                }
                group = await this.groups.findByIdAndRemove(group._id);
                resolve(group);
            }
            catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Verify if the user is the group admin
     * @param groupID 
     * @param userID 
     */
    private async isAdmin(groupID: string, userID: string): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {
            let group: Groups;
            try {
                group = await this.groups.findById(groupID, "-__v").exec();
                if (group) {
                    if (group.admin.toString() == userID.toString())
                        return resolve(true);
                    return resolve(false);
                }
                return resolve(false);
            }
            catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Delete all groups registered in the website
     * @requires website admin authorization
     */
    async deleteAllGroups(): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let group: Groups[];

            try {
                await this.groups.find({}).remove().exec();

                group = await this.groups.find({}).exec();

                if (group) {
                    return reject({
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: {
                            name: "Couldn't delete all groups"
                        }
                    });
                }
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: group
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Return a group identified by id
     * @param id the group id to return
     */
    async getGroup(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            
            let group: Groups;
            
            try {
                group = await this.groups.findById(id, "-__v")
                                         .populate([{
                                             path: "members",
                                             populate: {
                                                 path: "user"
                                             }
                                         },
                                         {
                                             path: "admin"
                                         }])
                                         .exec();

                if (group) {
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: group
                        }
                    });
                }

                return reject({
                    code: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Group ID not found"
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get group ID"
                    }
                });
            }
        });
    }

    /**
     * Return a group identified by name
     * @param name the group name to return
     */
    async getGroupName(name: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            
            let group: Groups;
            
            try {
                group = await this.groups.findOne({ name: name }, "-__v").exec();

                if (group) {
                    return resolve({
                        code: HTTPStatusCodes.OK,
                        body: {
                            result: group
                        }
                    });
                }

                return reject({
                    code: HTTPStatusCodes.NOT_FOUND,
                    body: {
                        name: "Group name not found"
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get group name"
                    }
                });
            }
        });
    }

    /**
     * Update group access type
     * @param groupID 
     * @param access 
     * @param userID
     * @param description
     */
    async updateGroup(groupID: string, access: string, userID: string, description: string): Promise<InsightResponse> {
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let group: Groups;

            try {
                const admin: boolean = await this.isAdmin(groupID, userID);
                if (!admin) {
                    return reject({
                        code: HTTPStatusCodes.UNAUTHORIZED,
                        body: {
                            name: "You're not authorized to update this group"
                        }
                    });
                }
                group = await this.groups.findById(groupID, "-__v").exec();
                
                if (!group) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Group ID not found"
                        }
                    });
                }
                let accessType: AccessType;
                if (access == "PUBLIC") {
                    accessType = AccessType.PUBLIC;
                }
                else {
                    accessType = AccessType.PRIVATE;
                }
                group.access = accessType;
                group.description = description;
                const saveGroup = new this.groups(group);
                await saveGroup.save();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: saveGroup
                    }
                });
            }
            catch(err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Return all users in this group
     * @param id the group id to query
     */
    async getGroupMembers(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let members: Groups;

            try {
                members = await this.groups.findById(id)
                                            .populate([{
                                                path: "members",
                                                populate: {
                                                    path: "user"
                                                }
                                            },
                                            "admin"])
                                            .exec();
                
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: members
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get group members"
                    }
                });
            }
        });
    }

    
    /**
     * @param id
     * @returns all group coming contests
     */
    async getComingContests(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Groups;
            let comingContests: any[] = [];

            try {
                contests = await this.groups.findById(id)
                                            .populate({
                                                path: "contests",
                                                populate: [{
                                                    path: "users"
                                                },
                                                {
                                                    path: "owner"
                                                }]
                                            })
                                            .exec();

                console.log("USERS COMING CONTEST: ", contests.contests);
                for (let i = 0; i < contests.contests.length; i++) {
                    let contest: any = contests.contests[i];
                    const date: Date = new Date(contest.startDate);
                    if (date.getTime() > Date.now()) {
                        comingContests.push(contest);
                    }
                }
                console.log("USERS COMING CONTEST: ", comingContests);
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: comingContests
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all contests attended by the user"
                    }
                });
            }
        });
    }

    /**
     * @param id
     * @returns all group running contests 
     */
    async getRunningContests(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Groups;
            let runningContests: any[] = [];

            try {
                contests = await this.groups.findById(id)
                                            .populate({
                                                path: "contests",
                                                populate: [{
                                                    path: "users"
                                                },
                                                {
                                                    path: "owner"
                                                }]
                                            })
                                            .exec();

                console.log("USERS RUNNING CONTEST: ", contests.contests);

                for (let i = 0; i < contests.contests.length; i++) {
                    let contest: any = contests.contests[i];
                    const date1: Date = new Date(contest.startDate);
                    const date2: Date = new Date(contest.endDate);
                    if (date1.getTime() < Date.now() && date2.getTime() > Date.now()) {
                        runningContests.push(contest);
                    }
                }
                console.log("USERS RUNNING CONTEST: ", runningContests);
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: runningContests
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all contests attended by the user"
                    }
                });
            }
        });
    }

    /**
     * @param id
     * @returns all group past contests 
     */
    async getContests(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Groups;
            let pastContests: any[] = [];

            try {
                contests = await this.groups.findById(id)
                                            .populate({
                                                path: "contests",
                                                populate: [{
                                                    path: "users"
                                                },
                                                {
                                                    path: "owner"
                                                }]
                                            })
                                            .exec();

                console.log("USERS PAST CONTEST: ", contests.contests);

                for (let i = 0; i < contests.contests.length; i++) {
                    let contest: any = contests.contests[i];
                    const date: Date = new Date(contest.endDate);
                    if (date.getTime() < Date.now()) {
                        pastContests.push(contest);
                    }
                }
                console.log("USERS PAST CONTEST: ", pastContests);
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: pastContests
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't get all contests attended by the user"
                    }
                });
            }
        });
    }

    /**
     * Add a user to the group and
     * Add the group to the user's groups list
     * @param groupID group id to query
     * @param userID user to add
     */
    async addGroupMember(groupID: string, userID: string, membership: string = "Participant"): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let user: Users;
            let group: Groups;

            try {
                user = await this.users.findById(userID, "-__v").exec();

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "User ID doesn't exist"
                        }
                    });
                }

                group = await this.groups.findById(groupID)
                                            .populate([{
                                                path: "members",
                                                populate: {
                                                    path: "user"
                                                }
                                            },
                                            "admin"])
                                            .exec();

                if (!group) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Group ID doesn't exist"
                        }
                    });
                }

                let isInTheGroup: boolean = await this.isUserAlreadyInTheGroup(user, groupID);
                if (isInTheGroup) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "User is already in the group"
                        }
                    });
                }

                let groupMember: GroupMembers = {
                    user: user._id,
                    joined: new Date(),
                    membershipType: membership
                };

                let saveGroupMember = new this.groupMembers(groupMember);
                await saveGroupMember.save();

                user.groups.push(groupID);
                group.members.push(saveGroupMember._id);

                const saveUser = new this.users(user);
                await saveUser.save();

                const saveGroup = new this.groups(group);
                await saveGroup.save();

                group = await this.groups.findById(groupID)
                                            .populate([{
                                                path: "members",
                                                populate: {
                                                    path: "user"
                                                }
                                            },
                                            "admin"])
                                            .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: group
                    }
                });
            }
            catch (err) {
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't add user to the group"
                    }
                });
            }
        });
    }

    /**
     * Verify if the user is already in the group
     * so that he(she) cannot be added more than once
     * @param user 
     * @param groupID
     */
    private isUserAlreadyInTheGroup(user: Users, groupID: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let groups: any[] = user.groups;
            let isRegistered = false;

            for (let i = 0; i < groups.length; i++) {
                if (groups[i] == groupID) {
                    isRegistered = true;
                    break;
                }
            }
            return resolve(isRegistered);
        });
    }

    /**
     * Remove a user from the group
     * @param groupID the group id to query
     * @param userID user to remove from the group
     */
    async deleteGroupMember(groupID: string, userID: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let user: Users;
            let group: Groups;
            let groupMember: GroupMembers;

            try {
                user = await this.users.findById(userID, "-__v").exec();

                if (!user) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "User ID doesn't exist"
                        }
                    });
                }

                group = await this.groups.findById(groupID)
                                            .populate([{
                                                path: "members",
                                                populate: {
                                                    path: "user"
                                                }
                                            },
                                            "admin"])
                                            .exec();

                if (!group) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Group ID doesn't exist"
                        }
                    });
                }

                const saveUser = new this.users(user);
                let userArray: any[] = saveUser.groups.filter((id) => id != groupID);
                saveUser.groups = [...userArray];
                await saveUser.save();

                let groupArray: any[] = group.members.filter((member: any) => member.user.username != user.username);
                group.members = [...groupArray];

                const saveGroup = new this.groups(group);
                await saveGroup.save();

                groupMember = await this.groupMembers.findOneAndRemove({user: user._id}).exec();

                group = await this.groups.findById(groupID)
                                            .populate([{
                                                path: "members",
                                                populate: {
                                                    path: "user"
                                                }
                                            },
                                            "admin"])
                                            .exec();

                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: group
                    }
                });
            }
            catch (err) {
                console.log("DELETE ERROR: ", err);
                return reject({
                    code: HTTPStatusCodes.BAD_REQUEST,
                    body: {
                        name: "Couldn't delete this user"
                    }
                });
            }
        });
    }
}