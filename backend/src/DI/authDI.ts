import { AuthController } from "../controllers/auth.controller"
import AuthRepo from "../repositories/auth.repo"
import { AuthService } from "../services/auth.services"

 const authRepo = new AuthRepo()
 const authService = new AuthService(authRepo)


 export const authController = new AuthController(authService)
