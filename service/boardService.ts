import { prismaClient } from "../prisma/prismaService"
import { ApiError } from "../exceptions/apiError";

class BoardService {

    async addBoard(name: string, description: string, creatorId: number) {
        const userToFind = await prismaClient.user.findFirst({
            where: {
                id: creatorId
            }
        })
        if (!userToFind)
            throw ApiError.BadRequest(`User with id ${creatorId} doesn't exist`)

        const board = await prismaClient.board.create({
            data: {
                name,
                description,
                creatorId,
                users: {
                    connect: [userToFind]
                },
                columns: {
                    createMany: {
                        data: [
                            { name: 'To do', order: 1 },
                            { name: 'In process', order: 2 },
                            { name: 'Done', order: 3 }
                        ]
                    }
                }
            }
        })
        return board
    }

    async updateBoard(name: string, description: string, boardId: number) {
        const boardToFind = await prismaClient.board.findFirst({
            where: {
                id: boardId
            }
        })
        if (!boardToFind)
            throw ApiError.BadRequest(`Board with id ${boardId} doesn't exist`)

        const board = await prismaClient.board.update({
            where: {id: boardId},
            data: {
                name,
                description
            }
        })
        return board
    }

    async deleteBoard(boardId: number, email: string) {
        const userDB = await prismaClient.user.findUnique({
            where: {
                email
            }
        })
        if (!userDB) {
            throw ApiError.BadRequest("Wrong credentials")
        }
        return await prismaClient.board.delete({
            where: {
                id: boardId,
                creatorId: userDB.id
            }
        })
    }

    async getById(boardId: number, email: string) {
        return await prismaClient.board.findUnique({
            where: {
                id: boardId,
                users: {
                    some: {
                        email
                    }
                }
            }
        })
    }

    async getByUserId(userId: number, email: string) {
        return await prismaClient.board.findMany({
            where: {
                users: {
                    some: {
                        id: userId,
                        email
                    }
                }
            }
        })
    }

}

export default new BoardService()