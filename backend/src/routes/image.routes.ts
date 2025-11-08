import express from "express";
import {
    saveImagesController,
    getUserImagesController,
    updateImageController,
    deleteImageController,
    updateImageOrderController
} from "../controllers/image.controller";
import { authenticateToken } from "../middlewares/auth";

const imageRoute = express.Router();

// All image routes require authentication
imageRoute.use(authenticateToken);

imageRoute.post("/", saveImagesController);
imageRoute.get("/", getUserImagesController);
imageRoute.put("/:id", updateImageController);
imageRoute.delete("/:id", deleteImageController);
imageRoute.put("/order/update", updateImageOrderController);

export default imageRoute;

