import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/apiError";
import boardService from "../service/boardService";

class BoardController {

    async addBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { name, description, creatorId } = req.body
            const boardData = await boardService.addBoard(name, description, creatorId)
            return res.json(boardData)
        } catch (e) {
            next(e)
        }
    }
    
    async updateBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { id, name, description, userIds } = req.body
            const boardData = await boardService.updateBoard(name, description, id, userIds)
            return res.json(boardData)
        } catch (e) {
            next(e)
        }
    }

    async deleteBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = Number(req.params.id)
            const boardData = await boardService.deleteBoard(boardId, (res as any).user.email)
            return res.json("Board has been deleted")
        } catch (e) {
            next(e)
        }
    }
    
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = Number(req.params.id)
            const board = await boardService.getById(boardId, (res as any).user.email)
            return res.json(board)
        } catch (e) {
            next(e)
        }
    }

    async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.id)
            const boards = await boardService.getByUserId(userId, (res as any).user.email)
            return res.json(boards)
        } catch (e) {
            next(e)
        }
    }
}

export default new BoardController()