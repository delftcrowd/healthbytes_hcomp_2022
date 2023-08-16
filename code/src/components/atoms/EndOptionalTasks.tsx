import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { endOptional, proceedTask } from "components/utils/task"
import { useState } from "react"
import { useAppDispatch } from "store/hooks"

const EndOptionalTaskButton = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = () => {
    dispatch(endOptional()).then(() => {
      dispatch(proceedTask())
    })
  }

  return <>
    <Button variant='contained' onClick={handleOpen} color="error">End Task</Button>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="End optional"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to leave?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          By choosing to end the task, you will be taken to the ending landing page, whereby you can access the exit survey. Once confirmed you will not be allowed to continue this task anymore.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="info" autoFocus>Cancel</Button>
        <Button onClick={handleSubmit} color="error">End Task</Button>
      </DialogActions>
    </Dialog>
  </>
}

export default EndOptionalTaskButton
