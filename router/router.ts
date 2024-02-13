import { Router } from "express";
import userController from "../controllers/userController";

const router = Router()

router.post('/auth/register', userController.register)
router.post('/auth/login', userController.login)
router.post('/auth/logout', userController.logout)
router.get('/auth/activate/:link', userController.activate)
router.get('/auth/refresh', userController.refresh)

export default router;