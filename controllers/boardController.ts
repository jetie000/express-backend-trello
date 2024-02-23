import { Response, Request, NextFunction } from "express"
import { validationResult } from "express-validator"
import { ApiError } from "../exceptions/apiError"
import BoardService from "../service/boardService"
import { IBoardService } from "../service/interfaces/boardService.interface"

class BoardController {
  constructor(private readonly boardService: IBoardService) {}
  async addBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()))
      }
      const { name, description, creatorId, userIds } = req.body
      const boardData = await this.boardService.addBoard(
        name,
        description,
        creatorId,
        userIds
      )
      return res.json(boardData)
    } catch (e) {
      next(e)
    }
  }

  async updateBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()))
      }
      const { id, name, description, userIds } = req.body
      const boardData = await this.boardService.updateBoard(
        name,
        description,
        id,
        userIds,
        (res as any).user.email
      )
      return res.json(boardData)
    } catch (e) {
      next(e)
    }
  }

  async deleteBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const boardId = Number(req.params.id)
      const boardData = await this.boardService.deleteBoard(
        boardId,
        (res as any).user.email
      )
      return res.json(boardData)
    } catch (e) {
      next(e)
    }
  }

  async leaveBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const boardId = Number(req.params.id)
      const boardData = await this.boardService.leaveBoard(
        boardId,
        (res as any).user.email
      )
      return res.json(boardData)
    } catch (e) {
      next(e)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const boardId = Number(req.params.id)
      const board = await this.boardService.getById(
        boardId,
        (res as any).user.email
      )
      return res.json(board)
    } catch (e) {
      next(e)
    }
  }

  async getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id)
      const boards = await this.boardService.getByUserId(
        userId,
        (res as any).user.email
      )
      return res.json(boards)
    } catch (e) {
      next(e)
    }
  }
}

export default new BoardController(new BoardService())
