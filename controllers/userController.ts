import { Response, Request, NextFunction } from "express";
import userService from "../service/userService";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/apiError";

class UserController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { email, password, fullName } = req.body
            const userData = await userService.register(email, password, fullName)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 3600 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 3600 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            await userService.logout(refreshToken) 
            res.clearCookie('refreshToken')
            res.status(200).send()
        } catch (e) {
            next(e)
        }
    }
    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            res.redirect(process.env.CLIENT_URL!)
        } catch (e) {
            next(e)
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 24 * 3600 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController()