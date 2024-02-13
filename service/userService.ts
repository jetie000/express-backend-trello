import { compare, hash } from "bcrypt";
import { prismaClient } from "../prisma/prismaService"
import { v4 } from "uuid";
import mailService from "./mailService";
import tokenService from "./tokenService";
import { ApiError } from "../exceptions/apiError";

class UserService {

    async register(email: string, password: string, fullName: string) {
        const userToFind = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
        if (userToFind)
            throw ApiError.BadRequest(`User with ${email} already exists`)

        const hashPassword = await hash(password, 5)
        const activationLinkId = v4()
        const tokens = tokenService.generateTokens({
            email,
            access: false
        })

        prismaClient.user.create({
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
        await mailService.sendActivationMail(email, process.env.API_URL + '/api/activate/' + activationLinkId)

        return { ...tokens, email }
    }

    async activate(activationLink: string) {
        const user = await prismaClient.user.findFirst({
            where: {
                activationLink
            }
        })
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        await prismaClient.user.updateMany({
            where: {
                activationLink
            },
            data: {
                access: true
            }
        })
    }

    async login(email: string, password: string) {
        const userToFind = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
        if (!userToFind)
            throw ApiError.BadRequest(`User with ${email} not found`)
        const isEqual = compare(password, userToFind.password)
        if (!isEqual)
            throw ApiError.BadRequest("Wrong password")
        const tokens = tokenService.generateTokens({
            email,
            access: userToFind.access
        })
        tokenService.saveToken(userToFind.id, tokens.refreshToken)
        return { ...tokens, email }
    }

    async logout(refreshToken: string){
        const token = await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if(!refreshToken)
            throw ApiError.UnauthorizedError()
        const userJwtData = tokenService.validateRefreshToken(refreshToken)
        const userFromDB = await tokenService.findByToken(refreshToken)
        if(!userJwtData || !userFromDB){
            throw ApiError.UnauthorizedError()
        }
        
        const tokens = tokenService.generateTokens({
            email: userFromDB.email,
            access: userFromDB.access
        })
        tokenService.saveToken(userFromDB.id, tokens.refreshToken)
        return { ...tokens, email: userFromDB.email }
    }
}

export default new UserService()