import { Response, Request, NextFunction } from "express";
import userService from "../service/userService";

class UserController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, fullName } = req.body
            const userData = await userService.register(email, password, fullName)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 3600 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            res.status(400).send()
            console.log(e);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }
    async activate(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }
}

export default new UserController()