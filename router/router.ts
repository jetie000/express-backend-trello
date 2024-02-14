import { Router } from "express";
import userController from "../controllers/userController";
import { body } from "express-validator";
import { authMiddleware } from "../middlewares/authMiddleware";

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

export default router;