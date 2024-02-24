import { body } from "express-validator"
import columnController from "../controllers/columnController"
import { authMiddleware } from "../middlewares/authMiddleware"
import router from "./router"

router.post(
  "/column",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  columnController.addColumn.bind(columnController)
)
router.put(
  "/column",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  body("order").trim().isInt(),
  columnController.updateColumn.bind(columnController)
)
router.delete(
  "/column/:id",
  authMiddleware,
  columnController.deleteColumn.bind(columnController)
)
