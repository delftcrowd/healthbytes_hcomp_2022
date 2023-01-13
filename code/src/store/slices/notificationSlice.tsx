import { AlertColor } from "@mui/material"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface NotificationType {
  message: string
  severity: AlertColor
  isOpen?: boolean
}

const initialState: NotificationType = {
  message: "",
  isOpen: false,
  severity: "info"
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationType>) => {
      state.message = action.payload.message
      state.isOpen = true
      state.severity = action.payload.severity
    },
    close: (state) => {
      state.isOpen = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { setNotification, close } = notificationSlice.actions

export default notificationSlice.reducer