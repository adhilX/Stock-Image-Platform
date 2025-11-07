import express from "express";
import { registerController, loginController } from "../controllers/auth.controller";
const authRoute = express.Router();

authRoute.post("/register", registerController);

authRoute.post("/login", loginController);

authRoute.get("/test", (req, res) => {
    res.json({ message: "Test route" });
});

export default authRoute;