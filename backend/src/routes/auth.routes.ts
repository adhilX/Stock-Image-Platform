import express from "express";
import { authenticateToken } from "../middlewares/auth";
import { authController } from "../DI/authDI";

const authRoute = express.Router();

authRoute.post("/register", authController.registerController);

authRoute.post("/login", authController.loginController);

authRoute.post("/refresh-token", authController.refreshTokenController);

authRoute.post("/logout", authController.logoutController);

authRoute.post("/change-password", authenticateToken, authController.changePasswordController);

authRoute.get("/test", (req, res) => {
    res.json({ message: "Test route" });
});

export default authRoute;