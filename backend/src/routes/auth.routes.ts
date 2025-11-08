import express from "express";
import { registerController, loginController, logoutController, changePasswordController, refreshTokenController } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth";

const authRoute = express.Router();

authRoute.post("/register", registerController);

authRoute.post("/login", loginController);

authRoute.post("/refresh-token", refreshTokenController);

authRoute.post("/logout", logoutController);

authRoute.post("/change-password", authenticateToken, changePasswordController);

authRoute.get("/test", (req, res) => {
    res.json({ message: "Test route" });
});

export default authRoute;