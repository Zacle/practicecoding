import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../../util/httpCode";
import { API_ERRORS } from "../../util/app.error";
import { Users } from "../../models/Users";
import { Teams } from "../../models/Teams";
import { Groups } from "../../models/Groups";
import { InsightResponse, AccessType } from "../../interfaces/InterfaceFacade";

@Service()
export class GroupsService {

    constructor(@Inject(Groups) private groups: MongooseModel<Groups>,
                @Inject(Users) private users: MongooseModel<Users>) {}

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
    
            try {

                let exist: boolean = await this.exists(name);

                if (exist) {
                    return reject({
                        code: HTTPStatusCodes.CONFLICT,
                        body: {
                            name: "Group name already exists"
                        }
                    });
                }
                await this.groups.create(group);
    
                result = await this.groups.findOne({name: name}, "-__v").exec();
    
                if (result) {
                    let ans: InsightResponse;
                    ans = await this.addGroupMember(result._id, userID);
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
     * @param userID
     */
    async getGroups(userID: any): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {

            let group: Users;

            try {
                group = await this.users.findById(userID, "-__v")
                                        .populate("groups")
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
                                        .exec();

                if (!group) {
                    return reject({
                        code: HTTPStatusCodes.ACCEPTED,
                        body: {
                            name: []
                        }
                    });
                }
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: group || []
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
                await IDs.forEach(async id => {
                    user = await this.users.findByIdAndUpdate(
                        id,
                        {$pull: {groups: {_id: id}}}
                    ).exec();
                });
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
                group = await this.groups.findById(id, "-__v").exec();

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
                        name: err
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
                        name: err
                    }
                });
            }
        });
    }

    /**
     * Update group access type
     * @param groupID 
     * @param access 
     */
    async updateGroup(groupID: string, access: string, userID: string): Promise<InsightResponse> {
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
                                            .populate("members")
                                            .exec();
                
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: members.members
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
     * Get all contests organized by this group
     * @param id the group id to query
     */
    async getGroupContests(id: string): Promise<InsightResponse> {
        
        return new Promise<InsightResponse>(async (resolve, reject) => {
            let contests: Groups;

            try {
                contests = await this.groups.findById(id)
                                            .populate("contests")
                                            .exec();
                
                return resolve({
                    code: HTTPStatusCodes.OK,
                    body: {
                        result: contests.contests
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
     * Add a user to the group and
     * Add the group to the user's groups list
     * @param groupID group id to query
     * @param userID user to add
     */
    async addGroupMember(groupID: string, userID: string): Promise<InsightResponse> {
        
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

                group = await this.groups.findById(groupID, "-__v").exec();

                if (!group) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Group ID doesn't exist"
                        }
                    });
                }

                user.groups.push(groupID);
                group.members.push(userID);

                const saveUser = new this.users(user);
                await saveUser.save();

                const saveGroup = new this.groups(group);
                await saveGroup.save();

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
     * Remove a user from the group
     * @param groupID the group id to query
     * @param userID user to remove from the group
     */
    async deleteGroupMember(groupID: string, userID: string): Promise<InsightResponse> {
        
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

                group = await this.groups.findById(groupID, "-__v").exec();

                if (!group) {
                    return reject({
                        code: HTTPStatusCodes.NOT_FOUND,
                        body: {
                            name: "Group ID doesn't exist"
                        }
                    });
                }

                let userArray: any[] = user.groups.filter((id) => id.toString() != groupID.toString());
                user.groups = [...userArray];
                let groupArray: any[] = group.members.filter((id) => id.toString() != userID.toString());
                group.members = [...groupArray];

                const saveUser = new this.users(user);
                await saveUser.save();

                const saveGroup = new this.groups(group);
                await saveGroup.save();

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
}