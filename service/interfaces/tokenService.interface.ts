import { JwtPayload } from "jsonwebtoken"
import { UserJwtPayload } from "../../types/userJwtPayload"
import { User } from "@prisma/client"

export interface ITokenService {
  generateTokens(payload: UserJwtPayload): {
    accessToken: string
    refreshToken: string
  }
  saveToken(userId: number, refreshToken: string): Promise<void>
  removeToken(refreshToken: string): Promise<void>
  validateAccessToken(token: string): string | JwtPayload | null
  validateRefreshToken(token: string): string | JwtPayload | null
  findByToken(token: string): Promise<User | null>
}
