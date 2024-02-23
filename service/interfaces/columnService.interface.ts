import { Column } from "@prisma/client"

export interface IColumnService {
  addColumn(name: string, boardId: number, email: string): Promise<Column>
  updateColumn(
    name: string,
    order: number,
    id: number,
    email: string
  ): Promise<Column>
  deleteColumn(id: number, email: string): Promise<Column>
}
