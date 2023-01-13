import { Typography } from '@mui/material'
import { CenterPage } from 'components/molecules/CenterCard'

const ConsentRevokedScreen = () => {

  return <CenterPage maxWidth='md'>
    <Typography variant='h4' marginBottom='1em'>Your consent has been revoked.</Typography>

    <Typography variant='subtitle1'>As you have indicated that you do not consent to participate in this study please return this submission on Prolific by selecting the 'STOP WITHOUT COMPLETING' button.</Typography>
    <Typography variant='subtitle1'>You may close this window.</Typography>

  </CenterPage>
}

export default ConsentRevokedScreen