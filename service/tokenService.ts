import { sign, verify } from "jsonwebtoken"
import { UserJwtPayload } from "../types/userJwtPayload"
import { configMy } from "../config/config"
import { ITokenService } from "./interfaces/tokenService.interface"
import { PrismaClient } from "@prisma/client"

class TokenService implements ITokenService {
  generateTokens(payload: UserJwtPayload) {
    const accessToken = sign(payload, configMy.JWT_SECRET!, {
      expiresIn: "30m"
    })
    const refreshToken = sign(payload, configMy.JWT_REFRESH_SECRET!, {
      expiresIn: "60d"
    })
    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token: string) {
    try {
      const userData = verify(token, configMy.JWT_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, configMy.JWT_REFRESH_SECRET!)
      return userData
    } catch (e) {
      return null
    }
  }
}

export default TokenService
