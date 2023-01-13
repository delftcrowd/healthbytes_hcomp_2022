import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SendingRequestState {
  isSending: boolean
}

const initialState: SendingRequestState = {
  isSending: false,
}

export const sendingRequestSlice = createSlice({
  name: 'sendingRequest',
  initialState,
  reducers: {
    sendingRequest: (state, action: PayloadAction<boolean>) => {
      state.isSending = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { sendingRequest } = sendingRequestSlice.actions

export default sendingRequestSlice.reducer