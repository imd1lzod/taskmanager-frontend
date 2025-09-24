export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  initials: string
}

export interface Board {
  id: string
  title: string
  description: string
  color: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  assignedUserId?: string
  assignedUser?: User
  dueDate?: string
  startDate?: string
  endDate?: string
  allDay?: boolean
  boardId: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Column {
  id: string
  title: string
  status: TaskStatus
  boardId: string
  tasks: Task[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface BoardState {
  boards: Board[]
  currentBoard: Board | null
  isLoading: boolean
}

export interface TaskState {
  tasks: Task[]
  isLoading: boolean
}

export interface RootState {
  auth: AuthState
  boards: BoardState
  tasks: TaskState
}

export interface CreateBoardData {
  title: string
  description: string
  color: string
}

export interface UpdateBoardData extends Partial<CreateBoardData> {
  id: string
}

export interface CreateTaskData {
  title: string
  description: string
  priority: TaskPriority
  tags: string[]
  assignedUserId?: string
  dueDate?: string
  startDate?: string
  endDate?: string
  allDay?: boolean
  boardId: string
  status: TaskStatus
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UpdateProfileData {
  name: string
  email: string
  avatar?: string
}
