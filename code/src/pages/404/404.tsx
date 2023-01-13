import { Button, Container, Paper, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

export function NothingFoundBackground() {

  const history = useHistory()

  const goBack = () => {
    history.push('/')
  }

  return (
    <Container maxWidth='sm' className='max-h-full'>
      <Paper className='flex flex-col text-center'>
        <Typography variant='h4' textAlign='center'>Nothing to see here</Typography>
        <Typography variant='subtitle1'>Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.</Typography>

        <Button variant='contained' onClick={goBack}>Take me back to home page</Button>
      </Paper>
    </Container>
  )
}