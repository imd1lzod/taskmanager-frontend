import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User, LoginData, RegisterData, UpdateProfileData } from '../../types'
import { getInitials } from '../../lib/utils'
import { api, fetchCurrentUser } from '../../hooks/api'
import { register as registerApi } from '../../../api/auth/register.api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false,
}

// No localStorage persistence for user anymore

export const initSession = createAsyncThunk(
  'auth/initSession',
  async (_, { rejectWithValue }) => {
    try {
      // Attempt to refresh access token, then fetch current user
      await api.post('/auth/refresh')
      const me = await fetchCurrentUser()
      if (!me?.id) {
        return { user: null }
      }
      const user: User = {
        id: String(me.id),
        name: me.name,
        email: me.email,
        avatar: me.avatar,
        initials: getInitials(me.name || 'User'),
      }
      return { user }
    } catch (error) {
      return rejectWithValue('Not authenticated')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', loginData)
      // After setting cookies, fetch the real user from backend
      const me = await fetchCurrentUser()
      const user: User = {
        id: String(me?.id ?? ''),
        name: me?.name ?? loginData.email.split('@')[0],
        email: me?.email ?? loginData.email,
        avatar: me?.avatar,
        initials: getInitials(((me?.name ?? loginData.email.split('@')[0]) || 'User')),
      }
      return user
    } catch (error: any) {
      const message = error?.response?.data?.message || (error instanceof Error ? error.message : 'Login failed')
      return rejectWithValue(Array.isArray(message) ? message[0] : message)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      // Only send fields accepted by backend
      const payload = { name: registerData.name, email: registerData.email, password: registerData.password }
      const data = await registerApi(payload)
      // After registration sets cookies, fetch real user
      const me = await fetchCurrentUser()
      const user: User = {
        id: String(me?.id ?? ''),
        name: me?.name ?? registerData.name,
        email: me?.email ?? registerData.email,
        avatar: me?.avatar,
        initials: getInitials((me?.name ?? registerData.name) || 'User'),
      }
      return user
    } catch (error: any) {
      const message = error?.response?.data?.message || (error instanceof Error ? error.message : 'Registration failed')
      return rejectWithValue(Array.isArray(message) ? message[0] : message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: UpdateProfileData, { getState, rejectWithValue }) => {
    try {
      // TODO: call backend when profile update endpoint exists
      const me = await fetchCurrentUser()
      return {
        id: String(me?.id ?? ''),
        name: me?.name ?? profileData.name,
        email: me?.email ?? profileData.email,
        avatar: me?.avatar ?? profileData.avatar,
        initials: getInitials(me?.name ?? profileData.name),
      } as User
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Profile update failed')
    }
  }
)

// Initial user is null; app should rely on explicit login
const getInitialUser = (): User | null => null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    user: getInitialUser(),
    isAuthenticated: !!getInitialUser(),
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Init session
      .addCase(initSession.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initSession.fulfilled, (state, action) => {
        state.isLoading = false
        state.initialized = true
        const user = action.payload?.user as User | null
        if (user) {
          state.user = user
          state.isAuthenticated = true
        } else {
          state.user = null
          state.isAuthenticated = false
        }
      })
      .addCase(initSession.rejected, (state) => {
        state.isLoading = false
        state.initialized = true
        state.user = null
        state.isAuthenticated = false
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
