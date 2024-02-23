import { sign, verify } from "jsonwebtoken"
import { prismaClient } from "../prisma/prismaService"
import { UserJwtPayload } from "../types/userJwtPayload"
import { config } from "../config/config"
import { ITokenService } from "./interfaces/tokenService.interface"

class TokenService implements ITokenService{
  generateTokens(payload: UserJwtPayload) {
    const accessToken = sign(payload, config.JWT_SECRET!, {
      expiresIn: "30m"
    })
    const refreshToken = sign(payload, config.JWT_REFRESH_SECRET!, {
      expiresIn: "60d"
    })
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
  async removeToken(refreshToken: string) {
    await prismaClient.user.updateMany({
      where: { refreshToken: refreshToken },
      data: { refreshToken: undefined }
    })
  }

  validateAccessToken(token: string) {
    try {
      const userData = verify(token, config.JWT_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, config.JWT_REFRESH_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  }

  async findByToken(token: string) {
    return await prismaClient.user.findFirst({
      where: { refreshToken: token }
    })
  }
}

export default TokenService
