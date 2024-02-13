import { Response, Request, NextFunction } from "express";
import { ApiError } from "../exceptions/apiError";
import tokenService from "../service/tokenService";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader)
            return next(ApiError.UnauthorizedError())
        const accessToken = authHeader.split(' ')[1]
        if (!accessToken)
            return next(ApiError.UnauthorizedError())
        const userJwtData = tokenService.validateAccessToken(accessToken)
        if (!userJwtData)
            return next(ApiError.UnauthorizedError())
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}