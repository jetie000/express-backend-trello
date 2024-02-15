import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/apiError";
import taskService from "../service/taskService";

class TaskController {

    async addTask(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { name, description, userIds, columnId } = req.body
            const columnData = await taskService.addTask(name, description, userIds, columnId, (res as any).user.email)
            return res.json(columnData)
        } catch (e) {
            next(e)
        }
    }
    async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation Error", errors.array()))
            }
            const { id, name, description, userIds, columnId } = req.body
            const columnData = await taskService.updateTask(id, name, description, userIds, columnId, (res as any).user.email)
            return res.json(columnData)
        } catch (e) {
            next(e)
        }
    }
    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const taskId = Number(req.params.id)
            const boardId = Number(req.params.boardId)
            const taskData = await taskService.deleteTask(boardId, taskId, (res as any).user.email)
            return res.json("Task has been deleted")
        } catch (e) {
            next(e)
        }
    }
}

export default new TaskController()