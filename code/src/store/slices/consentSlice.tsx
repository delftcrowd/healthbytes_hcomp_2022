import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ConsentState {
  isRevoked: boolean
}

const initialState: ConsentState = {
  isRevoked: false,
}

export const consentSlice = createSlice({
  name: 'consent',
  initialState,
  reducers: {
    setIsRevoked: (state, action: PayloadAction<boolean>) => {
      state.isRevoked = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setIsRevoked } = consentSlice.actions

export default consentSlice.reducer