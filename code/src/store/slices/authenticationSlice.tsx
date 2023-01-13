import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AuthenticationState {
  username: string
  prolificId?: string
}

const initialState: AuthenticationState = {
  username: '',
  prolificId: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string, password: string }>) => {
      state.username = action.payload.username
    },
    register: (state, action: PayloadAction<{ username: string, password: string, prolificId: string }>) => {
      state.username = action.payload.username
      state.prolificId = action.payload.prolificId
    },
    logout: (state, action: PayloadAction<void>) => {
      state.username = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, register } = authSlice.actions

export default authSlice.reducer