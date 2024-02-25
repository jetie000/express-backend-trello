import { body } from "express-validator"
import boardController from "../controllers/boardController"
import { authMiddleware } from "../middlewares/authMiddleware"
import { Router } from "express"

const boardRouter = Router()

boardRouter.get(
  "/:id",
  authMiddleware,
  boardController.getById.bind(boardController)
)
boardRouter.post(
  "/",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  boardController.addBoard.bind(boardController)
)
boardRouter.put(
  "/",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  boardController.updateBoard.bind(boardController)
)
boardRouter.delete(
  "/:id",
  authMiddleware,
  boardController.deleteBoard.bind(boardController)
)
boardRouter.post(
  "/:id/leave",
  authMiddleware,
  boardController.leaveBoard.bind(boardController)
)
boardRouter.get(
  "/user/:id",
  authMiddleware,
  boardController.getByUserId.bind(boardController)
)

export default boardRouter