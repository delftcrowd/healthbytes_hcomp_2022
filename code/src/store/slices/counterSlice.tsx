import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface CounterState {
  progress: number
  maxTime: number
}

const initialState: CounterState = {
  progress: 0,
  maxTime: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    startCounter: (state, action: PayloadAction<{ maxTime: number }>) => {
      state.maxTime = action.payload.maxTime
      state.progress = action.payload.maxTime
    },
    updateCounter: (state, action: PayloadAction<{ progress: number }>) => {
      state.progress = action.payload.progress
    },
    resetCounter: (state, action: PayloadAction<void>) => {
      state.maxTime = 0
      state.progress = 0
    }
  },
})

// Action creators are generated for each case reducer function
export const { startCounter, updateCounter, resetCounter } = counterSlice.actions

export default counterSlice.reducer