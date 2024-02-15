import { compare, hash } from "bcrypt";
import { prismaClient } from "../prisma/prismaService"
import { v4 } from "uuid";
import mailService from "./mailService";
import tokenService from "./tokenService";
import { ApiError } from "../exceptions/apiError";
import { User } from "@prisma/client";

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

        await prismaClient.user.create({
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
        await mailService.sendActivationMail(email, process.env.API_URL + '/api/auth/activate/' + activationLinkId)

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
        if (!userToFind.access) {
            throw ApiError.BadRequest("Confirm your account")
        }
        const tokens = tokenService.generateTokens({
            email,
            access: userToFind.access
        })
        await prismaClient.user.update({
            where: { id: userToFind.id },
            data: { loginDate: new Date() }
        })
        tokenService.saveToken(userToFind.id, tokens.refreshToken)
        return { ...tokens, email, id: userToFind.id }
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken)
            throw ApiError.UnauthorizedError()
        const userJwtData = tokenService.validateRefreshToken(refreshToken)
        const userFromDB = await tokenService.findByToken(refreshToken)
        if (!userJwtData || !userFromDB) {
            throw ApiError.UnauthorizedError()
        }

        const tokens = tokenService.generateTokens({
            email: userFromDB.email,
            access: userFromDB.access
        })
        tokenService.saveToken(userFromDB.id, tokens.refreshToken)
        return { ...tokens, email: userFromDB.email }
    }

    async getById(userId: number, email: string) {
        return await prismaClient.user.findFirst({
            where: {
                id: userId,
                email
            }
        })
    }

    async getByIds(ids: string) {
        const idsArr = ids.split('_').map(el => Number(el))
        const users = await prismaClient.user.findMany({
            where: {
                id: {
                    in: idsArr
                }
            },
            select: {
                email: true,
                fullName: true,
                loginDate: true,
                boardsPartipated: true,
                tasksParticipated: true
            }
        })
        return users
    }

    async updateUser(id: number, email: string, password: string, fullName: string, oldPassword: string) {
        const userToFind = await prismaClient.user.findFirst({
            where: { email: email }
        })
        if (userToFind)
            throw ApiError.BadRequest(`User with ${email} already exists`)

        const oldPass = await hash(oldPassword, 5)
        const userThis = await prismaClient.user.findFirst({
            where: { id, password: oldPass }
        })
        if (!userThis)
            throw ApiError.BadRequest(`User with id ${id} or that refresh token doesn't exist`)
        const access = userThis.email === email
        const hashPassword = await hash(password, 5)
        const activationLinkId = v4()
        const tokens = tokenService.generateTokens({
            email,
            access: false
        })

        await prismaClient.user.update({
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
            await mailService.sendActivationMail(email, process.env.API_URL + '/api/activate/' + activationLinkId)
        return { ...tokens, email }
    }

    async deleteUser(userId: number, email: string) {
        const userDB = await prismaClient.user.findUnique({
            where: {
                id: userId,
                email
            }
        })
        if (!userDB) {
            throw ApiError.BadRequest("Wrong credentials")
        }
        return await prismaClient.user.delete({
            where: { id: userId, email },
        })
    }
}

export default new UserService()