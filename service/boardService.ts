import { prismaClient } from "../prisma/prismaService"
import { ApiError } from "../exceptions/apiError";

class BoardService {

    async addBoard(name: string, description: string, creatorId: number, userIds: number[]) {
        const userToFind = await prismaClient.user.findFirst({
            where: {
                id: creatorId
            }
        })
        if (!userToFind)
            throw ApiError.BadRequest(`User with id ${creatorId} doesn't exist`)
        const userIdsToConnect = userIds.slice()
        if(!userIdsToConnect.find(id => id === creatorId))
            userIdsToConnect.push(creatorId)
        const board = await prismaClient.board.create({
            data: {
                name,
                description,
                creatorId,
                users: {
                    connect: userIdsToConnect.map(id => ({ id: id }))
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

    async updateBoard(name: string, description: string, boardId: number, userIds: number[]) {
        const boardToFind = await prismaClient.board.findFirst({
            where: {
                id: boardId
            }
        })
        if (!boardToFind)
            throw ApiError.BadRequest(`Board with id ${boardId} doesn't exist`)

        const board = await prismaClient.board.update({
            where: { id: boardId },
            data: {
                name,
                description,
                users: {
                    connect: userIds.map(id => ({ id: id }))
                }
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
            },
            include: {
                columns: {
                    include: {
                        tasks: {
                            include: {
                                users: {
                                    select: {
                                        email: true,
                                        fullName: true,
                                        loginDate: true
                                    }
                                }
                            }
                        }
                    }
                },
                users: {
                    select: {
                        email: true,
                        fullName: true,
                        loginDate: true
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