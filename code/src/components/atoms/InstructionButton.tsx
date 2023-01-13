import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"

const InstructionButton: React.FC = ({ ...props }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return <div className="fixed top-0 right-0 mt-2 mr-2">
    <Button variant='outlined' color='info' onClick={handleOpen}>Instructions</Button>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
      aria-labelledby="Instructions"
    >
      <DialogTitle id="alert-dialog-title">
        Instructions
      </DialogTitle>
      <DialogContent className="text-justify">
        {props.children}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="info" autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  </div>
}

export default InstructionButton
