import { body } from "express-validator"
import userController from "../controllers/userController"
import router from "./router"

router.post(
  "/auth/register",
  body("email").isEmail(),
  body("password").trim().isLength({ min: 8, max: 30 }),
  body("fullName").trim().notEmpty(),
  userController.register
)
router.post("/auth/login", userController.login.bind(userController))
router.post("/auth/logout", userController.logout.bind(userController))
router.get("/auth/activate/:link", userController.activate.bind(userController))
router.get("/auth/refresh", userController.refresh.bind(userController))
