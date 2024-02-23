import { ApiError } from "../exceptions/apiError"
import { ITaskService } from "./interfaces/taskService.interface"
import { PrismaClient } from "@prisma/client"

class TaskService implements ITaskService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async addTask(
    name: string,
    description: string,
    userIds: number[],
    columnId: number,
    email: string
  ) {
    const boardToFind = await this.prismaClient.board.findFirst({
      where: {
        columns: {
          some: { id: columnId }
        },
        users: {
          some: { email }
        }
      }
    })
    if (!boardToFind)
      throw ApiError.BadRequest(
        `Board with column id ${columnId} doesn't exist`
      )

    const task = await this.prismaClient.task.create({
      data: {
        name,
        description,
        users: {
          connect: userIds.map(id => ({ id: id }))
        },
        creationDate: new Date(),
        moveDate: new Date(),
        columnId
      }
    })
    return task
  }

  async updateTask(
    id: number,
    name: string,
    description: string,
    userIds: number[],
    columnId: number,
    email: string
  ) {
    const boardToFind = await this.prismaClient.board.findFirst({
      where: {
        columns: {
          some: { id: columnId }
        },
        users: {
          some: { email }
        }
      }
    })
    if (!boardToFind)
      throw ApiError.BadRequest(
        `Board with column id ${columnId} doesn't exist`
      )
    const taskToFind = await this.prismaClient.task.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true }
        }
      }
    })
    if (!taskToFind)
      throw ApiError.BadRequest(`Task with id ${columnId} doesn't exist`)
    const moveDate =
      columnId === taskToFind.columnId ? taskToFind.moveDate : new Date()
    const task = await this.prismaClient.task.update({
      where: { id },
      data: {
        name,
        description,
        users: {
          disconnect: taskToFind.users,
          connect: userIds.map(id => ({ id: id }))
        },
        moveDate,
        columnId
      }
    })
    return task
  }

  async deleteTask(boardId: number, id: number, email: string) {
    const boardToFind = await this.prismaClient.board.findUnique({
      where: {
        id: boardId,
        users: {
          some: { email }
        }
      }
    })
    if (!boardToFind) {
      throw ApiError.BadRequest(`Board with id ${boardId} doesn't exist`)
    }
    return await this.prismaClient.task.delete({
      where: { id }
    })
  }
}

export default TaskService
