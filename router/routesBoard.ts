import { body } from "express-validator"
import boardController from "../controllers/boardController"
import { authMiddleware } from "../middlewares/authMiddleware"
import router from "./router"

router.get(
  "/board/:id",
  authMiddleware,
  boardController.getById.bind(boardController)
)
router.post(
  "/board",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  boardController.addBoard.bind(boardController)
)
router.put(
  "/board",
  authMiddleware,
  body("name").trim().isLength({ min: 3, max: 30 }),
  boardController.updateBoard.bind(boardController)
)
router.delete(
  "/board/:id",
  authMiddleware,
  boardController.deleteBoard.bind(boardController)
)
router.post(
  "/board/:id/leave",
  authMiddleware,
  boardController.leaveBoard.bind(boardController)
)
router.get(
  "/board/user/:id",
  authMiddleware,
  boardController.getByUserId.bind(boardController)
)
