import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/apiError";
import columnService from "../service/columnService";

class ColumnController {

    async addColumn(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { name, boardId } = req.body
            const columnData = await columnService.addColumn(name, boardId, (res as any).user.email)
            return res.json(columnData)
        } catch (e) {
            next(e)
        }
    }
    async updateColumn(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { id, name, order } = req.body
            const columnData = await columnService.updateColumn(name, Number(order), id, (res as any).user.email)
            return res.json(columnData)
        } catch (e) {
            next(e)
        }
    }
    async deleteColumn(req: Request, res: Response, next: NextFunction) {
        try {
            const columnId = Number(req.params.id)
            const columnData = await columnService.deleteColumn(columnId, (res as any).user.email)
            return res.json(columnData)
        } catch (e) {
            next(e)
        }
    }
}

export default new ColumnController()