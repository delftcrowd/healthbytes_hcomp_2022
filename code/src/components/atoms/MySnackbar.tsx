import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material"
import { useAppDispatch, useAppSelector } from "store/hooks"
import { close } from "store/slices/notificationSlice"
import { RootState } from "store/store"

const MySnackbar = () => {
  const notification = useAppSelector((state: RootState) => state.notification)
  const dispatch = useAppDispatch()

  const handleClose = (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(close())
  }

  return (
    <Snackbar open={notification.isOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }
      } variant="filled" >
        {notification.message}
      </Alert >
    </Snackbar >
  )
}

export default MySnackbar