import { body } from "express-validator"
import userController from "../controllers/userController"
import { authMiddleware } from "../middlewares/authMiddleware"
import { Router } from "express"

const userRouter = Router()

userRouter.get(
  "/:id",
  authMiddleware,
  userController.getById.bind(userController)
)
userRouter.get(
  "/getByIds/:ids",
  authMiddleware,
  userController.getByIds.bind(userController)
)
userRouter.put(
  "/",
  body("email").isEmail(),
  body("password").trim().optional().isLength({ min: 8, max: 30 }),
  body("fullName").trim().notEmpty(),
  authMiddleware,
  userController.updateUser.bind(userController)
)
userRouter.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser.bind(userController)
)
userRouter.get(
  "/search/:search",
  authMiddleware,
  userController.searchUsers.bind(userController)
)

export default userRouter
