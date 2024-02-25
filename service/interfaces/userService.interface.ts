import { Board, Task, User } from "@prisma/client"

export interface IUserService {
  register(
    email: string,
    password: string,
    fullName: string
  ): Promise<string>
  activate(activationLink: string): Promise<User[] | void>
  login(email: string, password: string): Promise<ILoginResponse>
  logout(refreshToken: string): Promise<void>
  refresh(refreshToken: string): Promise<IRegisterResponse>
  getById(userId: number, email: string): Promise<User | null>
  getByIds(ids: string): Promise<IUserMain[]>
  updateUser(
    id: number,
    email: string,
    password: string,
    fullName: string,
    oldPassword: string
  ): Promise<IRegisterResponse>
  deleteUser(userId: number, email: string): Promise<User>
  searchUsers(search: string): Promise<IUserMain[]>
  saveToken(userId: number, refreshToken: string): Promise<void>
}

interface IRegisterResponse {
  accessToken: string
  refreshToken: string
  email: string
}

interface ILoginResponse {
  accessToken: string
  refreshToken: string
  email: string
  id: number
}

interface IUserMain
  extends Omit<
    User,
    "password" | "access" | "activationLink" | "refreshToken" | "joinDate"
  > {
  boardsPartipated?: Board[]
  tasksParticipated?: Task[]
}
