import { Response, Request, NextFunction } from "express"
import { validationResult } from "express-validator"
import { ApiError } from "../exceptions/apiError"
import { configMy } from "../config/config"
import UserService from "../service/userService"
import TokenService from "../service/tokenService"
import MailService from "../service/mailService"
import { prismaClient } from "../prisma/prismaService"
import { IUserService } from "../service/interfaces/userService.interface"

class UserController {
  public constructor(private readonly userService: IUserService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()))
      }
      const { email, password, fullName } = req.body
      const userData = await this.userService.register(
        email,
        password,
        fullName
      )
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const userData = await this.userService.login(email, password)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 60 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies
      await this.userService.logout(refreshToken)
      res.clearCookie("refreshToken")
      res.status(200).send()
    } catch (e) {
      next(e)
    }
  }
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link
      await this.userService.activate(activationLink)
      res.redirect(configMy.CLIENT_URL! + "/login")
    } catch (e) {
      next(e)
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies
      const userData = await this.userService.refresh(refreshToken)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 60 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()))
      }
      const { id, email, oldPassword, password, fullName } = req.body
      const userData = await this.userService.updateUser(
        id,
        email,
        password,
        fullName,
        oldPassword
      )
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 60 * 24 * 3600 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id)
      await this.userService.deleteUser(userId, (res as any).user.email)
      return res.json("User has been deleted")
    } catch (e) {
      next(e)
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id)
      const user = await this.userService.getById(
        userId,
        (res as any).user.email
      )
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async getByIds(req: Request, res: Response, next: NextFunction) {
    try {
      const userIds = req.params.ids
      const users = await this.userService.getByIds(userIds)
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }
  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.params.search
      const users = await this.userService.searchUsers(search)
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController(
  new UserService(new TokenService(), new MailService(), prismaClient)
)
