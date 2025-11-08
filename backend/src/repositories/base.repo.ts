import { Model } from "mongoose";
import { IBaseRepo } from "../interfaces/Irepo/Ibase.repo";

export default class BaseRepo<TPersistence, TDomain> implements IBaseRepo<TDomain> {
    constructor(protected _model: Model<TPersistence>) { }

    protected   toEntity(data: TPersistence): TDomain {
        return data as unknown as TDomain;
    }

    async create(data: TDomain): Promise<TDomain> {
        const createdData = await this._model.create(data);
        return this.toEntity(createdData);
    }
    async findByEmail(email: string): Promise<TDomain | null> {
        const user = await this._model.findOne({ email });
        return user ? this.toEntity(user) : null;
    }
    async findByShortUrl(shortUrl: string): Promise<TDomain | null> {
        const record = await this._model.findOne({ shortUrl });
        return record ? this.toEntity(record) : null;
    }
}