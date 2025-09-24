import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Board, CreateBoardData, UpdateBoardData } from '../../types'
import { generateId } from '../../lib/utils'
import { seedBoards } from '../../data/seedData'

interface BoardState {
  boards: Board[]
  currentBoard: Board | null
  isLoading: boolean
  error: string | null
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,
}

// Load boards from localStorage
const loadBoardsFromStorage = (): Board[] => {
  try {
    const boardsData = localStorage.getItem('taskManager_boards')
    if (boardsData) {
      return JSON.parse(boardsData)
    }
    // If no data in localStorage, initialize with seed data
    const boards = seedBoards as Board[]
    saveBoardsToStorage(boards)
    return boards
  } catch {
    return seedBoards as Board[]
  }
}

// Save boards to localStorage
const saveBoardsToStorage = (boards: Board[]) => {
  localStorage.setItem('taskManager_boards', JSON.stringify(boards))
}

// Async thunks
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const boards = loadBoardsFromStorage()
      return boards
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch boards')
    }
  }
)

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: CreateBoardData, { getState, rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const state = getState() as { auth: { user: { id: string } } }
      const userId = state.auth.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }
      
      const newBoard: Board = {
        id: generateId(),
        ...boardData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
      }
      
      const currentBoards = loadBoardsFromStorage()
      const updatedBoards = [...currentBoards, newBoard]
      saveBoardsToStorage(updatedBoards)
      
      return newBoard
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create board')
    }
  }
)

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async (boardData: UpdateBoardData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const currentBoards = loadBoardsFromStorage()
      const boardIndex = currentBoards.findIndex(board => board.id === boardData.id)
      
      if (boardIndex === -1) {
        throw new Error('Board not found')
      }
      
      const updatedBoard: Board = {
        ...currentBoards[boardIndex],
        ...boardData,
        updatedAt: new Date().toISOString(),
      }
      
      currentBoards[boardIndex] = updatedBoard
      saveBoardsToStorage(currentBoards)
      
      return updatedBoard
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update board')
    }
  }
)

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const currentBoards = loadBoardsFromStorage()
      const filteredBoards = currentBoards.filter(board => board.id !== boardId)
      saveBoardsToStorage(filteredBoards)
      
      return boardId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete board')
    }
  }
)

export const fetchBoardById = createAsyncThunk(
  'boards/fetchBoardById',
  async (boardId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const boards = loadBoardsFromStorage()
      const board = boards.find(b => b.id === boardId)
      
      if (!board) {
        throw new Error('Board not found')
      }
      
      return board
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch board')
    }
  }
)

const boardSlice = createSlice({
  name: 'boards',
  initialState: {
    ...initialState,
    boards: loadBoardsFromStorage(),
  },
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Boards
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false
        state.boards = action.payload
        state.error = null
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Board
      .addCase(createBoard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.isLoading = false
        state.boards.push(action.payload)
        state.error = null
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Board
      .addCase(updateBoard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.boards.findIndex(board => board.id === action.payload.id)
        if (index !== -1) {
          state.boards[index] = action.payload
        }
        if (state.currentBoard?.id === action.payload.id) {
          state.currentBoard = action.payload
        }
        state.error = null
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Board
      .addCase(deleteBoard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.isLoading = false
        state.boards = state.boards.filter(board => board.id !== action.payload)
        if (state.currentBoard?.id === action.payload) {
          state.currentBoard = null
        }
        state.error = null
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Board by ID
      .addCase(fetchBoardById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentBoard = action.payload
        state.error = null
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentBoard, clearError } = boardSlice.actions
export default boardSlice.reducer
