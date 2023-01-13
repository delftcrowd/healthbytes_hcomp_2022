import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ProlificState {
  prolificId: string
}

const initialState: ProlificState = {
  prolificId: "",
}

export const prolificSlice = createSlice({
  name: 'prolific',
  initialState,
  reducers: {
    setProlificId: (state, action: PayloadAction<string>) => {
      state.prolificId = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProlificId } = prolificSlice.actions

export default prolificSlice.reducer