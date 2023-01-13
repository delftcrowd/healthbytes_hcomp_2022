import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ErrorState {
  message: string
}

const initialState: ErrorState = {
  message: '',
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
    clearErrorMessage: (state) => {
      state.message = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { setErrorMessage, clearErrorMessage } = errorSlice.actions

export default errorSlice.reducer