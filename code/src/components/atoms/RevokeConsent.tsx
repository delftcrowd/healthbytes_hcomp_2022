import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { revokeConsent } from "components/utils/task"
import { useState } from "react"
import { useAppDispatch } from "store/hooks"

const RevokeConsentButton = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = () => {
    dispatch(revokeConsent())
  }

  return <div className="fixed top-0 left-0 mt-2 ml-2">
    <Button variant='contained' onClick={handleOpen}>REVOKE CONSENT</Button>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="Revoke consent"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure to leave?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          By revoking your consent, you will NOT RECEIVE any reward or payment. Once confirmed you will not be allowed to continue or finish this task anymore.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="info" autoFocus>Cancel</Button>
        <Button onClick={handleSubmit} color="error">Revoke consent</Button>
      </DialogActions>
    </Dialog>
  </div>
}

export default RevokeConsentButton
