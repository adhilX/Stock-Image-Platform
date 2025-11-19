import { ImageController } from "../controllers/image.controller";
import ImageRepo from "../repositories/image.repo";
import { ImageService } from "../services/image.services";

 const imageRepo = new ImageRepo();
 const imageService = new ImageService(imageRepo);

 export const imageController = new ImageController(imageService)
