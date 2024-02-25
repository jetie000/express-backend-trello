import { Response, Request, NextFunction } from "express"
import { validationResult } from "express-validator"
import { ApiError } from "../exceptions/apiError"
import ColumnService from "../service/columnService"
import { IColumnService } from "../service/interfaces/columnService.interface"
import { prismaClient } from "../prisma/prismaService"

class ColumnController {
  constructor(private readonly columnService: IColumnService) {}
  async addColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()))
      }
      const { name, boardId } = req.body
      const columnData = await this.columnService.addColumn(
        name,
        boardId,
        (res as any).user.email
      )
      return res.json(columnData)
    } catch (e) {
      next(e)
    }
  }
  async updateColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()))
      }
      const { id, name, order } = req.body
      const columnData = await this.columnService.updateColumn(
        name,
        Number(order),
        id,
        (res as any).user.email
      )
      return res.json(columnData)
    } catch (e) {
      next(e)
    }
  }
  async deleteColumn(req: Request, res: Response, next: NextFunction) {
    try {
      const columnId = Number(req.params.id)
      const columnData = await this.columnService.deleteColumn(
        columnId,
        (res as any).user.email
      )
      return res.json(columnData)
    } catch (e) {
      next(e)
    }
  }
}

export default new ColumnController(new ColumnService(prismaClient))
