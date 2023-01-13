import { Button, Container, Paper, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

export function NotAllowedPage() {

  const history = useHistory()

  const goBack = () => {
    history.push('/')
  }

  return (
    <Container maxWidth='sm' className='max-h-full'>
      <Paper className='flex flex-col text-center'>
        <Typography variant='h4' textAlign='center'>Access not allowed</Typography>
        <Typography variant='subtitle1'>Your network or device is restricting access to this website. If you still want to complete the research, please switch network if in a restricted network or switch device if using a work computer. Otherwise, please return this submission on Prolific by selecting the 'STOP WITHOUT COMPLETING' button. Thank you for your undestanding.</Typography>

        <Button variant='contained' onClick={goBack}>Take me back to home page</Button>
      </Paper>
    </Container>
  )
}