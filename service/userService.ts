import { hash } from "bcrypt";
import { prismaClient } from "../prisma/prismaService"
import { v4 } from "uuid";
import mailService from "./mailService";
import tokenService from "./tokenService";

class UserService {

    async register(email: string, password: string, fullName: string) {
        const userToFind = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
        if (userToFind)
            throw new Error(`User with ${email} already exists`)

        const hashPassword = await hash(password, 5)
        const activationLink = v4()
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
                activationLink,
                refreshToken: tokens.refreshToken
            }
        })
        await mailService.sendActivationMail(email, activationLink)

        return {...tokens, email }
    }

}

export default new UserService()