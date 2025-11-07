import AuthRepo from "../repositories/auth.repo"
import { AuthService } from "../services/auth.services"

export const authRepo = new AuthRepo()
export const authService = new AuthService(authRepo)


