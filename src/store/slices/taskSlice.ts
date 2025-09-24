import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '../../types'
import { generateId } from '../../lib/utils'
import { getAllTasks } from '../../../api/task/task.api'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
}

// Load tasks from localStorage (no seeding fallback)
const loadTasksFromStorage = (): Task[] => {
  try {
    const tasksData = localStorage.getItem('taskManager_tasks')
    if (tasksData) return JSON.parse(tasksData)
    return []
  } catch {
    return []
  }
}

// Save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem('taskManager_tasks', JSON.stringify(tasks))
}

// Async thunks
export const fetchTasksByBoard = createAsyncThunk(
  'tasks/fetchTasksByBoard',
  async (boardId: string, { rejectWithValue }) => {
    try {
      const res = await getAllTasks()
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []
      // Map backend tasks (Prisma) to frontend Task type
      const mapped: Task[] = items.map((t: any) => ({
        id: String(t.id),
        title: t.title,
        description: t.description ?? '',
        status: String(t.status || 'Todo').toLowerCase().replace('inprogress','in-progress') as TaskStatus,
        priority: String(t.priority || 'Medium').toLowerCase(),
        tags: [],
        assignedUserId: undefined,
        assignedUser: undefined,
        dueDate: undefined,
        startDate: t.startDate ? new Date(t.startDate).toISOString() : undefined,
        endDate: t.endDate ? new Date(t.endDate).toISOString() : undefined,
        allDay: !!t.allDay,
        boardId: boardId,
        createdAt: (t.date ? new Date(t.date) : new Date()).toISOString(),
        updatedAt: (t.date ? new Date(t.date) : new Date()).toISOString(),
      }))
      return mapped
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks')
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: CreateTaskData, { getState, rejectWithValue }) => {
    try {
      // In a real app this would call backend. For now, keep local without seeding.
      const state = getState() as { auth: { user: { id: string } } }
      const userId = state.auth.user?.id
      if (!userId) throw new Error('User not authenticated')

      const newTask: Task = {
        id: generateId(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const currentTasks = loadTasksFromStorage()
      const updatedTasks = [...currentTasks, newTask]
      saveTasksToStorage(updatedTasks)
      return newTask
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task')
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskData: UpdateTaskData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const currentTasks = loadTasksFromStorage()
      const taskIndex = currentTasks.findIndex(task => task.id === taskData.id)
      
      if (taskIndex === -1) {
        throw new Error('Task not found')
      }
      
      const updatedTask: Task = {
        ...currentTasks[taskIndex],
        ...taskData,
        updatedAt: new Date().toISOString(),
      }
      
      currentTasks[taskIndex] = updatedTask
      saveTasksToStorage(currentTasks)
      
      return updatedTask
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task')
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const currentTasks = loadTasksFromStorage()
      const filteredTasks = currentTasks.filter(task => task.id !== taskId)
      saveTasksToStorage(filteredTasks)
      
      return taskId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task')
    }
  }
)

export const moveTask = createAsyncThunk(
  'tasks/moveTask',
  async ({ taskId, newStatus }: { taskId: string; newStatus: TaskStatus }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const currentTasks = loadTasksFromStorage()
      const taskIndex = currentTasks.findIndex(task => task.id === taskId)
      
      if (taskIndex === -1) {
        throw new Error('Task not found')
      }
      
      const updatedTask: Task = {
        ...currentTasks[taskIndex],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }
      
      currentTasks[taskIndex] = updatedTask
      saveTasksToStorage(currentTasks)
      
      return updatedTask
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to move task')
    }
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    ...initialState,
    tasks: loadTasksFromStorage(),
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearTasks: (state) => {
      state.tasks = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks by Board
      .addCase(fetchTasksByBoard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasksByBoard.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload
        state.error = null
      })
      .addCase(fetchTasksByBoard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks.push(action.payload)
        state.error = null
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = state.tasks.filter(task => task.id !== action.payload)
        state.error = null
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Move Task
      .addCase(moveTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
        state.error = null
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearTasks } = taskSlice.actions
export default taskSlice.reducer
