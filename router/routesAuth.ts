import { body } from "express-validator"
import userController from "../controllers/userController"
import { Router } from "express"

const authRouter = Router()

authRouter.post(
  "/register",
  body("email").isEmail(),
  body("password").trim().isLength({ min: 8, max: 30 }),
  body("fullName").trim().notEmpty(),
  userController.register.bind(userController)
)
authRouter.post("/login", userController.login.bind(userController))
authRouter.post("/logout", userController.logout.bind(userController))
authRouter.get("/activate/:link", userController.activate.bind(userController))
authRouter.get("/refresh", userController.refresh.bind(userController))

export default authRouter
