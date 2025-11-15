import { IImage } from "../../entity/image.entity";
import { PaginatedResult } from "../Irepo/Iimage.repo";

export interface IImageService {
    saveImages(images: IImage[]): Promise<IImage[]>;
    getUserImages(userId: string, page?: number, limit?: number): Promise<PaginatedResult<IImage>>;
    updateImage(id: string, userId: string, imageData: Partial<IImage>): Promise<IImage>;
    deleteImage(id: string, userId: string): Promise<void>;
    updateImageOrder(images: { id: string; order: number }[]): Promise<void>;
}

