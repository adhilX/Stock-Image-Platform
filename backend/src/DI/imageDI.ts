import ImageRepo from "../repositories/image.repo";
import { ImageService } from "../services/image.services";

export const imageRepo = new ImageRepo();
export const imageService = new ImageService(imageRepo);

