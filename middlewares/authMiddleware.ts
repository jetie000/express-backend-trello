import { Response, Request, NextFunction } from "express"
import { ApiError } from "../exceptions/apiError"
import tokenService from "../service/tokenService"
import { UserJwtPayload } from "../types/userJwtPayload"
import { prismaClient } from "../prisma/prismaService"

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return next(ApiError.UnauthorizedError())
    const accessToken = authHeader.split(" ")[1]
    if (!accessToken) return next(ApiError.UnauthorizedError())
    const userJwtData = tokenService.validateAccessToken(accessToken)
    if (!userJwtData) return next(ApiError.UnauthorizedError())
    const user = await prismaClient.user.findFirst({
      where: {
        email: (userJwtData as UserJwtPayload).email
      }
    })
    if (user) (res as any).user = user
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
