import { body } from "express-validator"
import taskController from "../controllers/taskController"
import { authMiddleware } from "../middlewares/authMiddleware"
import router from "./router"

router.post(
  "/task",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  body("userIds").isArray(),
  taskController.addTask.bind(taskController)
)
router.put(
  "/task",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  body("userIds").isArray(),
  taskController.updateTask.bind(taskController)
)
router.delete(
  "/task/:id/board/:boardId",
  authMiddleware,
  taskController.deleteTask.bind(taskController)
)
