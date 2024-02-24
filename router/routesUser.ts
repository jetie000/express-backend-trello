import { body } from "express-validator"
import userController from "../controllers/userController"
import { authMiddleware } from "../middlewares/authMiddleware"
import router from "./router"

router.get(
  "/user/:id",
  authMiddleware,
  userController.getById.bind(userController)
)
router.get(
  "/user/getByIds/:ids",
  authMiddleware,
  userController.getByIds.bind(userController)
)
router.put(
  "/user",
  body("email").isEmail(),
  body("password").trim().isLength({ min: 8, max: 30 }),
  body("fullName").trim().notEmpty(),
  authMiddleware,
  userController.updateUser.bind(userController)
)
router.delete("/user/:id", authMiddleware, userController.deleteUser)
router.get("/user/search/:search", authMiddleware, userController.searchUsers)
