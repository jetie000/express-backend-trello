import { body } from "express-validator"
import columnController from "../controllers/columnController"
import { authMiddleware } from "../middlewares/authMiddleware"
import { Router } from "express"

const columnRouter = Router()

columnRouter.post(
  "/",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  columnController.addColumn.bind(columnController)
)
columnRouter.put(
  "/",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  body("order").trim().isInt(),
  columnController.updateColumn.bind(columnController)
)
columnRouter.delete(
  "/:id",
  authMiddleware,
  columnController.deleteColumn.bind(columnController)
)

export default columnRouter