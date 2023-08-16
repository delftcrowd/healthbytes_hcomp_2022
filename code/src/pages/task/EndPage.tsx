import { Button, Typography } from "@mui/material"
import { CenterPage } from "components/molecules/CenterCard"
import { openInNewTab } from "components/utils/utilsTS"
import { COMPLETION_LINK } from "constants/AppConstants"

export const EndPage = () => {

  const handleComplete = () => {
    openInNewTab(COMPLETION_LINK)
  }

  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>End of the task!</Typography>

      <Typography variant='subtitle1'>Thank you for participating! By clicking the button below, you will be redirected back to the crowdsourcing platform.</Typography>

      <Button
        variant='contained'
        onClick={handleComplete}
        sx={{ marginTop: '1em' }}
        color={'success'}>End research</Button>
    </CenterPage>
  )
}