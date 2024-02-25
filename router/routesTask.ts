import { body } from "express-validator"
import taskController from "../controllers/taskController"
import { authMiddleware } from "../middlewares/authMiddleware"
import { Router } from "express"

const taskRouter = Router()

taskRouter.post(
  "/",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  body("userIds").isArray(),
  taskController.addTask.bind(taskController)
)
taskRouter.put(
  "/",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  body("userIds").isArray(),
  taskController.updateTask.bind(taskController)
)
taskRouter.delete(
  "/:id/board/:boardId",
  authMiddleware,
  taskController.deleteTask.bind(taskController)
)

export default taskRouter