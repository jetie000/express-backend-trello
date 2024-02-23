import { Task } from "@prisma/client"

export interface ITaskService {
  addTask(
    name: string,
    description: string,
    userIds: number[],
    columnId: number,
    email: string
  ): Promise<Task>
  updateTask(
    id: number,
    name: string,
    description: string,
    userIds: number[],
    columnId: number,
    email: string
  ): Promise<Task>
  deleteTask(boardId: number, id: number, email: string): Promise<Task>
}
