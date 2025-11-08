import { IImage } from "../entity/image.entity";
import { IImageRepo } from "../interfaces/Irepo/Iimage.repo";
import Image, { MongooseImage } from "../models/image.model";
import BaseRepo from "./base.repo";

export default class ImageRepo extends BaseRepo<MongooseImage, IImage> implements IImageRepo {
    constructor() {
        super(Image);
    }

    async findByUserId(userId: string): Promise<IImage[]> {
        const images = await this._model.find({ userId }).sort({ order: 1 });
        return images.map(img => this.toEntity(img));
    }

    async findById(id: string): Promise<IImage | null> {
        const image = await this._model.findById(id);
        return image ? this.toEntity(image) : null;
    }

    async update(id: string, data: Partial<IImage>): Promise<IImage> {
        const updated = await this._model.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            throw new Error("Image not found");
        }
        return this.toEntity(updated);
    }

    async updateOrder(images: { id: string; order: number }[]): Promise<void> {
        const updatePromises = images.map(({ id, order }) =>
            this._model.findByIdAndUpdate(id, { order })
        );
        await Promise.all(updatePromises);
    }

    async deleteById(id: string): Promise<void> {
        await this._model.findByIdAndDelete(id);
    }
}

