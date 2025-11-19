import { Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";
import { handleControllerError } from "../utils/responseError";
import { IImage } from "../entity/image.entity";
import { AuthRequest } from "../middlewares/auth";
import { IImageService } from "../interfaces/Iservice/IImage.service";

export class ImageController{
    constructor(private _imageService:IImageService){}

saveImagesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { images } = req.body; // Expect array of { image, title, order }
        
        if (!images || !Array.isArray(images) || images.length === 0) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Images array is required" });
            return;
        }

        // Add userId to each image
        const imagesWithUserId: IImage[] = images.map((img: any, index: number) => ({
            userId,
            image: img.image || img.url,
            title: img.title,
            order: img.order !== undefined ? img.order : index
        }));

        const savedImages = await this._imageService.saveImages(imagesWithUserId);
        
        res.status(StatusCode.CREATED).json({
            message: "Images saved successfully",
            images: savedImages
        });
    } catch (error) {
        handleControllerError(error, res, "saveImages");
    }
};

    getUserImagesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await this._imageService.getUserImages(userId, page, limit);
        
        res.status(StatusCode.OK).json({
            message: "Images retrieved successfully",
            ...result
        });
    } catch (error) {
        handleControllerError(error, res, "getUserImages");
    }
};

 updateImageController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { id } = req.params;
        const { image, title } = req.body;

        const updatedImage = await this._imageService.updateImage(id, userId, { image, title });
        
        res.status(StatusCode.OK).json({
            message: "Image updated successfully",
            image: updatedImage
        });
    } catch (error) {
        handleControllerError(error, res, "updateImage");
    }
};

 deleteImageController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { id } = req.params;
        await this._imageService.deleteImage(id, userId);
        
        res.status(StatusCode.OK).json({
            message: "Image deleted successfully"
        });
    } catch (error) {
        handleControllerError(error, res, "deleteImage");
    }
};

 updateImageOrderController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }

        const { images } = req.body; // Expect array of { id, order }
        
        if (!images || !Array.isArray(images)) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Images array with id and order is required" });
            return;
        }

        await this._imageService.updateImageOrder(images);
        
        res.status(StatusCode.OK).json({
            message: "Image order updated successfully"
        });
    } catch (error) {
        handleControllerError(error, res, "updateImageOrder");
    }
};

}