import { compare, hash } from "bcrypt"
import { v4 } from "uuid"
import { ApiError } from "../exceptions/apiError"
import { configMy } from "../config/config"
import { IUserService } from "./interfaces/userService.interface"
import { ITokenService } from "./interfaces/tokenService.interface"
import { IMailService } from "./interfaces/mailService.interface"
import { PrismaClient } from "@prisma/client"

class UserService implements IUserService {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly mailService: IMailService,
    private readonly prismaClient: PrismaClient
  ) {
    // console.log("ccc serv");
    
  }

  async register(email: string, password: string, fullName: string) {
    const userToFind = await this.prismaClient.user.findFirst({
      where: {
        email: email
      }
    })
    if (userToFind)
      throw ApiError.BadRequest(`User with ${email} already exists`)

    const hashPassword = await hash(password, 5)
    const activationLinkId = v4()
    const tokens = this.tokenService.generateTokens({
      email,
      access: false
    })

    await this.prismaClient.user.create({
      data: {
        email,
        fullName,
        password: hashPassword,
        joinDate: new Date(),
        loginDate: new Date(),
        activationLink: activationLinkId,
        refreshToken: tokens.refreshToken
      }
    })
    await this.mailService.sendActivationMail(
      email,
      configMy.API_URL + "/api/auth/activate/" + activationLinkId
    )

    return { ...tokens, email }
  }

  async activate(activationLink: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        activationLink
      }
    })
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link")
    }
    await this.prismaClient.user.updateMany({
      where: {
        activationLink
      },
      data: {
        access: true
      }
    })
  }

  async login(email: string, password: string) {
    console.log("SERVICE")

    const userToFind = await this.prismaClient.user.findFirst({
      where: {
        email: email
      }
    })
    if (!userToFind) throw ApiError.BadRequest(`User with ${email} not found`)
    const isEqual = compare(password, userToFind.password)
    if (!isEqual) throw ApiError.BadRequest("Wrong password")
    if (!userToFind.access) {
      throw ApiError.BadRequest("Confirm your account")
    }
    const tokens = this.tokenService.generateTokens({
      email,
      access: userToFind.access
    })
    await this.prismaClient.user.update({
      where: { id: userToFind.id },
      data: { loginDate: new Date() }
    })
    this.saveToken(userToFind.id, tokens.refreshToken)
    return { ...tokens, email, id: userToFind.id }
  }

  async logout(refreshToken: string) {
    await this.prismaClient.user.updateMany({
      where: { refreshToken: refreshToken },
      data: { refreshToken: undefined }
    })
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw ApiError.UnauthorizedError()
    const userJwtData = this.tokenService.validateRefreshToken(refreshToken)
    const userFromDB = await this.prismaClient.user.findFirst({
      where: { refreshToken }
    })
    if (!userJwtData || !userFromDB) {
      throw ApiError.UnauthorizedError()
    }

    const tokens = this.tokenService.generateTokens({
      email: userFromDB.email,
      access: userFromDB.access
    })
    this.saveToken(userFromDB.id, tokens.refreshToken)
    return { ...tokens, email: userFromDB.email }
  }

  async getById(userId: number, email: string) {
    return await this.prismaClient.user.findFirst({
      where: {
        id: userId,
        email
      }
    })
  }

  async getByIds(ids: string) {
    const idsArr = ids.split("_").map(el => Number(el))
    const users = await this.prismaClient.user.findMany({
      where: {
        id: {
          in: idsArr
        }
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        loginDate: true,
        boardsPartipated: true,
        tasksParticipated: true
      }
    })
    return users
  }

  async updateUser(
    id: number,
    email: string,
    password: string,
    fullName: string,
    oldPassword: string
  ) {
    const userToFind = await this.prismaClient.user.findFirst({
      where: { email: email }
    })
    if (userToFind)
      throw ApiError.BadRequest(`User with ${email} already exists`)

    const oldPass = await hash(oldPassword, 5)
    const userThis = await this.prismaClient.user.findFirst({
      where: { id, password: oldPass }
    })
    if (!userThis)
      throw ApiError.BadRequest(
        `User with id ${id} or that refresh token doesn't exist`
      )
    const access = userThis.email === email
    const hashPassword = await hash(password, 5)
    const activationLinkId = v4()
    const tokens = this.tokenService.generateTokens({
      email,
      access: false
    })

    await this.prismaClient.user.update({
      where: {
        id: id
      },
      data: {
        email,
        fullName,
        password: hashPassword,
        activationLink: activationLinkId,
        access,
        refreshToken: tokens.refreshToken
      }
    })
    if (!access)
      await this.mailService.sendActivationMail(
        email,
        configMy.API_URL + "/api/activate/" + activationLinkId
      )
    return { ...tokens, email }
  }

  async deleteUser(userId: number, email: string) {
    const userDB = await this.prismaClient.user.findUnique({
      where: {
        id: userId,
        email
      }
    })
    if (!userDB) {
      throw ApiError.BadRequest("Wrong credentials")
    }
    return await this.prismaClient.user.delete({
      where: { id: userId, email }
    })
  }

  async searchUsers(search: string) {
    return await this.prismaClient.user.findMany({
      where: {
        OR: [
          {
            email: { contains: search }
          },
          {
            fullName: { contains: search }
          }
        ]
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        loginDate: true,
        boardsPartipated: true,
        tasksParticipated: true
      }
    })
  }

  async saveToken(userId: number, refreshToken: string) {
    await this.prismaClient.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken }
    })
  }
}

export default UserService
