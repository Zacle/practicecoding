import { Inject , Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { HTTPStatusCodes } from "../util/httpCode";
import { API_ERRORS } from "../util/app.error";
import { Users } from "../models/Users";
import { InsightResponse, IUser } from "../interfaces/InterfaceFacade";

@Service()
export class UsersService {

    constructor(@Inject(Users) private users: MongooseModel<Users>) {}

    async find(): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async findById(id: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async findByEmail(email: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async findByCredential(email: string, password: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async create(user: IUser): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async updateProfile(profile: any): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async updatePassword(password: string, confirmation: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async verifyEmailToken(token: string): Promise<Boolean> {
        return Promise.reject(false);
    }

    async updateEmail(token: string, email: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async verifyPasswordToken(token: string): Promise<Boolean> {
        return Promise.reject(false);
    }

    async updatePasswordToken(token: string, password: string): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }

    async forgotPassword(): Promise<InsightResponse> {
        return Promise.reject({code: HTTPStatusCodes.NOT_IMPLEMENTED, body: null});
    }
}