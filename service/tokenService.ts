import { sign } from "jsonwebtoken"
import { prismaClient } from "../prisma/prismaService"
import { UserJwtPayload } from "../types/userJwtPayload"

class TokenService {
    generateTokens(payload: UserJwtPayload) {
        const accessToken = sign(payload, process.env.JWT_SECRET!, { expiresIn: '30m' })
        const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '60d' })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        await prismaClient.user.update({
            where: { id: userId },
            data: { refreshToken: refreshToken }
        })
    }
}

export default new TokenService()