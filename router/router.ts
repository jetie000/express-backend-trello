import { Router } from "express"
import { body } from "express-validator"
import { authMiddleware } from "../middlewares/authMiddleware"
import userController from "../controllers/userController"
import boardController from "../controllers/boardController"
import columnController from "../controllers/columnController"
import taskController from "../controllers/taskController"

const router = Router()

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

export default router
