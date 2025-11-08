import { IBaseRepo } from "./Ibase.repo";
import { IUser } from "../../entity/user.entity";

export interface IUserRepo extends IBaseRepo<IUser> {
    findById(id: string): Promise<IUser | null>;
}