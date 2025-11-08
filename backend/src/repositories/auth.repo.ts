import { IUser } from "../entity/user.entity";
import { IUserRepo } from "../interfaces/Irepo/Iauth.repo";
import User, { MongooseUser } from "../models/user.model";
import BaseRepo from "./base.repo";

export default class AuthRepo extends BaseRepo<MongooseUser, IUser> implements IUserRepo{
    constructor() {
        super(User);
    }

    async findById(id: string): Promise<IUser | null> {
        const user = await this._model.findById(id);
        return user ? this.toEntity(user) : null;
    }
}

