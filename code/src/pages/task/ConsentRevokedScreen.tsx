import { Button, Typography } from '@mui/material'
import { CenterPage } from 'components/molecules/CenterCard'
import { openInNewTab } from "components/utils/utilsTS"
import { REVOKED_RETURN_LINK } from "constants/AppConstants"

const ConsentRevokedScreen = () => {

  const handleComplete = () => {
    openInNewTab(REVOKED_RETURN_LINK)
  }

  return <CenterPage maxWidth='md'>
    <Typography variant='h4' marginBottom='1em'>Your consent has been revoked.</Typography>

    <Typography variant='subtitle1'>As you have indicated that you do not consent to participate in this study, by clicking the button below you will be redirected back to the crowdsourcing platform.</Typography>
     {/* please return this submission on Prolific by selecting the 'STOP WITHOUT COMPLETING' button.</Typography> */}
    {/* <Typography variant='subtitle1'>You may close this window.</Typography> */}
    <Button
        variant='contained'
        onClick={handleComplete}
        sx={{ marginTop: '1em' }}
        color={'success'}>End research</Button>
  </CenterPage>
}

export default ConsentRevokedScreen