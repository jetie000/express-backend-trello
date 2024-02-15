import { Router } from "express";
import userController from "../controllers/userController";
import { body } from "express-validator";
import { authMiddleware } from "../middlewares/authMiddleware";
import boardController from "../controllers/boardController";

const router = Router()

router.post('/auth/register',
    body('email').isEmail(),
    body('password').trim().isLength({ min: 8, max: 30 }),
    body('fullName').trim().notEmpty(),
    userController.register)
router.post('/auth/login', userController.login)
router.post('/auth/logout', userController.logout)
router.get('/auth/activate/:link', userController.activate)
router.get('/auth/refresh', userController.refresh)

router.get('/user/:id', authMiddleware, userController.getById)
router.put('/user',
    body('email').isEmail(),
    body('password').trim().isLength({ min: 8, max: 30 }),
    body('fullName').trim().notEmpty(),
    authMiddleware,
    userController.updateUser)
router.delete('/user/:id', authMiddleware, userController.deleteUser)

router.get('/board/:id', authMiddleware, boardController.getById)
router.post('/board', authMiddleware,
    body('name').trim().isLength({ min: 3, max: 30 }),
    boardController.addBoard)
router.put('/board', authMiddleware,
    body('name').trim().isLength({ min: 3, max: 30 }),
    boardController.updateBoard)
router.delete('/board/:id', authMiddleware, boardController.deleteBoard)
router.get('/board/user/:id', authMiddleware, boardController.getByUserId)
router.get('/board/:id/addUser/:userId', authMiddleware, boardController.addUser)
router.get('/board/:id/removeUser/:userId', authMiddleware, boardController.removeUser)


export default router;