
import { PrismaClient } from "@prisma/client"
import { ApiError } from "../exceptions/apiError"
import { IColumnService } from "./interfaces/columnService.interface"

class ColumnService implements IColumnService {
  constructor(private readonly prismaClient: PrismaClient) {}
  async addColumn(name: string, boardId: number, email: string) {
    const boardToFind = await this.prismaClient.board.findUnique({
      where: {
        id: boardId,
        users: {
          some: {
            email
          }
        }
      },
      include: {
        columns: true
      }
    })
    if (!boardToFind)
      throw ApiError.BadRequest(`Board with id ${boardId} doesn't exist`)

    const column = await this.prismaClient.column.create({
      data: {
        name,
        order: boardToFind.columns.length + 1,
        board: {
          connect: {
            id: boardId
          }
        }
      }
    })
    return column
  }

  async updateColumn(name: string, order: number, id: number, email: string) {
    const boardToFind = await this.prismaClient.board.findFirst({
      where: {
        columns: {
          some: { id }
        },
        users: {
          some: { email }
        }
      },
      include: {
        columns: true
      }
    })
    if (!boardToFind)
      throw ApiError.BadRequest(`Board with column id ${id} doesn't exist`)

    const oldOrder = boardToFind.columns.find(c => c.id === id)?.order
    if (oldOrder && oldOrder !== order) {
      if (oldOrder < order) {
        await this.prismaClient.column.updateMany({
          where: {
            boardId: boardToFind.id,
            order: {
              gt: oldOrder,
              lte: order
            }
          },
          data: {
            order: { decrement: 1 }
          }
        })
      } else {
        await this.prismaClient.column.updateMany({
          where: {
            boardId: boardToFind.id,
            order: {
              gte: order,
              lt: oldOrder
            }
          },
          data: {
            order: { increment: 1 }
          }
        })
      }
    }
    const column = await this.prismaClient.column.update({
      where: { id },
      data: {
        name,
        order
      }
    })
    return column
  }

  async deleteColumn(id: number, email: string) {
    const boardToFind = await this.prismaClient.board.findFirst({
      where: {
        columns: {
          some: { id }
        },
        users: {
          some: { email }
        }
      }
    })
    if (!boardToFind) {
      throw ApiError.BadRequest(`Board with column id ${id} doesn't exist`)
    }
    return await this.prismaClient.column.delete({
      where: { id }
    })
  }
}

export default ColumnService
