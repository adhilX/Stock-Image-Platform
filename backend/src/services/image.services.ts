import { IImage } from "../entity/image.entity";
import { IImageRepo } from "../interfaces/Irepo/Iimage.repo";
import { IImageService } from "../interfaces/Iservice/IImage.service";

export class ImageService implements IImageService {
    constructor(private _imageRepo: IImageRepo) { }

    async saveImages(images: IImage[]): Promise<IImage[]> {
        const savedImages = await Promise.all(
            images.map(image => this._imageRepo.create(image))
        );
        return savedImages;
    }

    async getUserImages(userId: string): Promise<IImage[]> {
        return await this._imageRepo.findByUserId(userId);
    }

    async updateImage(id: string, userId: string, imageData: Partial<IImage>): Promise<IImage> {
        const image = await this._imageRepo.findById(id);
        if (!image) {
            throw new Error("Image not found");
        }
        if (image.userId.toString() !== userId) {
            throw new Error("You don't have permission to update this image");
        }
        return await this._imageRepo.update(id, imageData);
    }

    async deleteImage(id: string, userId: string): Promise<void> {
        const image = await this._imageRepo.findById(id);
        if (!image) {
            throw new Error("Image not found");
        }
        if (image.userId.toString() !== userId) {
            throw new Error("You don't have permission to delete this image");
        }
        await this._imageRepo.deleteById(id);
    }

    async updateImageOrder(images: { id: string; order: number }[]): Promise<void> {
        await this._imageRepo.updateOrder(images);
    }
}

