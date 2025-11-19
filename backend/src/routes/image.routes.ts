import express from "express";
import { authenticateToken } from "../middlewares/auth";
import { imageController } from "../DI/imageDI";

const imageRoute = express.Router();

// All image routes require authentication
imageRoute.use(authenticateToken);

imageRoute.post("/", imageController.saveImagesController);
imageRoute.get("/", imageController.getUserImagesController);
imageRoute.put("/:id", imageController.updateImageController);
imageRoute.delete("/:id", imageController.deleteImageController);
imageRoute.put("/order/update", imageController.updateImageOrderController);

export default imageRoute;

