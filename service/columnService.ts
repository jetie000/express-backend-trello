import { prismaClient } from "../prisma/prismaService"
import { ApiError } from "../exceptions/apiError"
import { IColumnService } from "./interfaces/columnService.interface"

class ColumnService implements IColumnService{
  async addColumn(name: string, boardId: number, email: string) {
    const boardToFind = await prismaClient.board.findUnique({
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

    const column = await prismaClient.column.create({
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
    const boardToFind = await prismaClient.board.findFirst({
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
        await prismaClient.column.updateMany({
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
        await prismaClient.column.updateMany({
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
    const column = await prismaClient.column.update({
      where: { id },
      data: {
        name,
        order
      }
    })
    return column
  }

  async deleteColumn(id: number, email: string) {
    const boardToFind = await prismaClient.board.findFirst({
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
    return await prismaClient.column.delete({
      where: { id }
    })
  }
}

export default ColumnService
