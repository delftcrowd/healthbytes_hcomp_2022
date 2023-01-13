import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface LoadingState {
  isLoading: boolean
}

const initialState: LoadingState = {
  isLoading: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setLoading } = loadingSlice.actions

export default loadingSlice.reducer