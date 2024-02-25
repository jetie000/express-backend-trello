import { Board, Column, Task, User } from "@prisma/client"

export interface IBoardService {
  addBoard(
    name: string,
    description: string,
    creatorId: number,
    userIds: number[]
  ): Promise<Board>
  updateBoard(
    name: string,
    description: string,
    boardId: number,
    userIds: number[],
    email: string
  ): Promise<Board>
  deleteBoard(boardId: number, email: string): Promise<Board>
  leaveBoard(boardId: number, email: string): Promise<Board>
  getById(boardId: number, email: string): Promise<IBoardFull | null>
  getByUserId(userId: number, email: string): Promise<Board[]>
}

interface IBoardFull extends Board {
  columns?: IColumnFull[]
  users: Pick<User, "id" | "email" | "fullName" | "loginDate">[]
}

interface IColumnFull extends Column {
  tasks?: ITaskFull[]
}

interface ITaskFull extends Task {
  users?: Pick<User, "id" | "email" | "fullName" | "loginDate">[]
}
