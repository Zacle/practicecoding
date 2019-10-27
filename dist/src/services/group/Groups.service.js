"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Users_1 = require("../../models/Users");
const Groups_1 = require("../../models/Groups");
const InterfaceFacade_1 = require("../../interfaces/InterfaceFacade");
const GroupMembers_1 = require("../../models/GroupMembers");
let GroupsService = class GroupsService {
    constructor(groups, users, groupMembers) {
        this.groups = groups;
        this.users = users;
        this.groupMembers = groupMembers;
    }
    /**
     * Create a new group and a user as the admin
     * @param name name of the group
     * @param access access type: PUBLIC OR PRIVATE
     * @param description description of the group
     * @param userID group owner
     */
    createGroup(name, userID, access, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let accessType;
                if (access == "PUBLIC") {
                    accessType = InterfaceFacade_1.AccessType.PUBLIC;
                }
                else {
                    accessType = InterfaceFacade_1.AccessType.PRIVATE;
                }
                let group = {
                    name: name,
                    admin: userID,
                    creation: new Date(),
                    contests: [],
                    members: [],
                    access: accessType,
                    description: description
                };
                let result;
                let total;
                try {
                    total = yield this.groups.find({}).count().exec();
                    group.name = (total + 1) + " - " + name;
                    let exist = yield this.exists(group.name);
                    if (exist) {
                        return reject({
                            code: 409 /* CONFLICT */,
                            body: {
                                name: "Group name already exists"
                            }
                        });
                    }
                    yield this.groups.create(group);
                    result = yield this.groups.findOne({ name: group.name }, "-__v").exec();
                    if (result) {
                        let ans;
                        ans = yield this.addGroupMember(result._id, userID, "Admin");
                        return resolve(ans);
                    }
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't create a group"
                        }
                    });
                }
                catch (err) {
                    console.log("CREATE ERROR: ", err);
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't create a group"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if a group with this name already exist
     * @param name
     */
    exists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    result = yield this.groups.findOne({ name: name }).exec();
                    if (result) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
                catch (err) {
                    return reject(err);
                }
            }));
        });
    }
    /**
     * Return all groups that contain the user
     * @param username
     */
    getGroups(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    group = yield this.users.findOne({ username: username }, "-__v")
                        .populate({
                        path: "groups",
                        populate: {
                            path: "admin"
                        }
                    })
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: group.groups
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return all groups of the web app
     */
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    group = yield this.groups.find({ access: InterfaceFacade_1.AccessType.PUBLIC }, "-__v")
                        .populate("admin")
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: group
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Delete a group identified by id
     * @param id the group id to delete
     * @requires group's admin authorization
     */
    deleteGroup(id, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    const admin = yield this.isAdmin(id, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to delete this group"
                            }
                        });
                    }
                    group = yield this.groups.findById(id, "-__v").exec();
                    if (group) {
                        group = yield this.deleteUserGroup(group);
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: group
                            }
                        });
                    }
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Group id not found"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * For each user in the group remove him(her) from the group
     * @param group
     */
    deleteUserGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                let IDs = [...group.members];
                try {
                    for (let i = 0; i < IDs.length; i++) {
                        const id = IDs[i];
                        user = yield this.users.findByIdAndUpdate(id, { $pull: { groups: { _id: id } } }).exec();
                    }
                    group = yield this.groups.findByIdAndRemove(group._id);
                    resolve(group);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    /**
     * Verify if the user is the group admin
     * @param groupID
     * @param userID
     */
    isAdmin(groupID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    group = yield this.groups.findById(groupID, "-__v").exec();
                    if (group) {
                        if (group.admin.toString() == userID.toString())
                            return resolve(true);
                        return resolve(false);
                    }
                    return resolve(false);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    /**
     * Delete all groups registered in the website
     * @requires website admin authorization
     */
    deleteAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    yield this.groups.find({}).remove().exec();
                    group = yield this.groups.find({}).exec();
                    if (group) {
                        return reject({
                            code: 400 /* BAD_REQUEST */,
                            body: {
                                name: "Couldn't delete all groups"
                            }
                        });
                    }
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: group
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return a group identified by id
     * @param id the group id to return
     */
    getGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    group = yield this.groups.findById(id, "-__v")
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
                            code: 200 /* OK */,
                            body: {
                                result: group
                            }
                        });
                    }
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Group ID not found"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get group ID"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return a group identified by name
     * @param name the group name to return
     */
    getGroupName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    group = yield this.groups.findOne({ name: name }, "-__v").exec();
                    if (group) {
                        return resolve({
                            code: 200 /* OK */,
                            body: {
                                result: group
                            }
                        });
                    }
                    return reject({
                        code: 404 /* NOT_FOUND */,
                        body: {
                            name: "Group name not found"
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get group name"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Update group access type
     * @param groupID
     * @param access
     * @param userID
     * @param description
     */
    updateGroup(groupID, access, userID, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let group;
                try {
                    const admin = yield this.isAdmin(groupID, userID);
                    if (!admin) {
                        return reject({
                            code: 401 /* UNAUTHORIZED */,
                            body: {
                                name: "You're not authorized to update this group"
                            }
                        });
                    }
                    group = yield this.groups.findById(groupID, "-__v").exec();
                    if (!group) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Group ID not found"
                            }
                        });
                    }
                    let accessType;
                    if (access == "PUBLIC") {
                        accessType = InterfaceFacade_1.AccessType.PUBLIC;
                    }
                    else {
                        accessType = InterfaceFacade_1.AccessType.PRIVATE;
                    }
                    group.access = accessType;
                    group.description = description;
                    const saveGroup = new this.groups(group);
                    yield saveGroup.save();
                    group = yield this.groups.findById(groupID, "-__v")
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
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: group
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: err
                        }
                    });
                }
            }));
        });
    }
    /**
     * Return all users in this group
     * @param id the group id to query
     */
    getGroupMembers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let members;
                try {
                    members = yield this.groups.findById(id)
                        .populate([{
                            path: "members",
                            populate: {
                                path: "user"
                            }
                        },
                        "admin"])
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: members
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get group members"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param id
     * @returns all group coming contests
     */
    getComingContests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                let comingContests = [];
                try {
                    contests = yield this.groups.findById(id)
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
                        let contest = contests.contests[i];
                        const date = new Date(contest.startDate);
                        if (date.getTime() > Date.now()) {
                            comingContests.push(contest);
                        }
                    }
                    console.log("USERS COMING CONTEST: ", comingContests);
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: comingContests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all contests attended by the user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param id
     * @returns all group running contests
     */
    getRunningContests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                let runningContests = [];
                try {
                    contests = yield this.groups.findById(id)
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
                        let contest = contests.contests[i];
                        const date1 = new Date(contest.startDate);
                        const date2 = new Date(contest.endDate);
                        if (date1.getTime() < Date.now() && date2.getTime() > Date.now()) {
                            runningContests.push(contest);
                        }
                    }
                    console.log("USERS RUNNING CONTEST: ", runningContests);
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: runningContests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all contests attended by the user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * @param id
     * @returns all group past contests
     */
    getContests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let contests;
                let pastContests = [];
                try {
                    contests = yield this.groups.findById(id)
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
                        let contest = contests.contests[i];
                        const date = new Date(contest.endDate);
                        if (date.getTime() < Date.now()) {
                            pastContests.push(contest);
                        }
                    }
                    console.log("USERS PAST CONTEST: ", pastContests);
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: pastContests
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't get all contests attended by the user"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Add a user to the group and
     * Add the group to the user's groups list
     * @param groupID group id to query
     * @param userID user to add
     */
    addGroupMember(groupID, userID, membership = "Participant") {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                let group;
                try {
                    user = yield this.users.findById(userID, "-__v").exec();
                    if (!user) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "User ID doesn't exist"
                            }
                        });
                    }
                    group = yield this.groups.findById(groupID)
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
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Group ID doesn't exist"
                            }
                        });
                    }
                    let isInTheGroup = yield this.isUserAlreadyInTheGroup(user, groupID);
                    if (isInTheGroup) {
                        return reject({
                            code: 409 /* CONFLICT */,
                            body: {
                                name: "User is already in the group"
                            }
                        });
                    }
                    let groupMember = {
                        user: user._id,
                        joined: new Date(),
                        membershipType: membership
                    };
                    let saveGroupMember = new this.groupMembers(groupMember);
                    yield saveGroupMember.save();
                    user.groups.push(groupID);
                    group.members.push(saveGroupMember._id);
                    const saveUser = new this.users(user);
                    yield saveUser.save();
                    const saveGroup = new this.groups(group);
                    yield saveGroup.save();
                    group = yield this.groups.findById(groupID)
                        .populate([{
                            path: "members",
                            populate: {
                                path: "user"
                            }
                        },
                        "admin"])
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: group
                        }
                    });
                }
                catch (err) {
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't add user to the group"
                        }
                    });
                }
            }));
        });
    }
    /**
     * Verify if the user is already in the group
     * so that he(she) cannot be added more than once
     * @param user
     * @param groupID
     */
    isUserAlreadyInTheGroup(user, groupID) {
        return new Promise((resolve) => {
            let groups = user.groups;
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
    deleteGroupMember(groupID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user;
                let group;
                let groupMember;
                try {
                    user = yield this.users.findById(userID, "-__v").exec();
                    if (!user) {
                        return reject({
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "User ID doesn't exist"
                            }
                        });
                    }
                    group = yield this.groups.findById(groupID)
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
                            code: 404 /* NOT_FOUND */,
                            body: {
                                name: "Group ID doesn't exist"
                            }
                        });
                    }
                    const saveUser = new this.users(user);
                    let userArray = saveUser.groups.filter((id) => id != groupID);
                    saveUser.groups = [...userArray];
                    yield saveUser.save();
                    let groupArray = group.members.filter((member) => member.user.username != user.username);
                    group.members = [...groupArray];
                    const saveGroup = new this.groups(group);
                    yield saveGroup.save();
                    groupMember = yield this.groupMembers.findOneAndRemove({ user: user._id }).exec();
                    group = yield this.groups.findById(groupID)
                        .populate([{
                            path: "members",
                            populate: {
                                path: "user"
                            }
                        },
                        "admin"])
                        .exec();
                    return resolve({
                        code: 200 /* OK */,
                        body: {
                            result: group
                        }
                    });
                }
                catch (err) {
                    console.log("DELETE ERROR: ", err);
                    return reject({
                        code: 400 /* BAD_REQUEST */,
                        body: {
                            name: "Couldn't delete this user"
                        }
                    });
                }
            }));
        });
    }
};
GroupsService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Groups_1.Groups)),
    __param(1, common_1.Inject(Users_1.Users)),
    __param(2, common_1.Inject(GroupMembers_1.GroupMembers)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GroupsService);
exports.GroupsService = GroupsService;
//# sourceMappingURL=Groups.service.js.map