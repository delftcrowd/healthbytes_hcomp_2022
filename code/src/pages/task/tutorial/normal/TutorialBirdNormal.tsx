import { Card, CardContent, CardMedia, Grid, Tooltip, Typography } from '@mui/material'
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from 'components/molecules/CenterCard'
import { BIRD_OPTIONS } from 'constants/AppConstants'


export const TutorialBirdNormal = () => {
  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>
        In the following questions, you'll be presented with the image of a bird and asked to identify what type of beak it has, based on the beak shape. To help you familiarize with the names of the various shapes, we've provided a primer for the different variations that you can visualise by hovering over each card. Please study this primer and familiarize yourself with the different shapes birds' beaks can take, and how they are named. Later, you will be asked to identify the beak of 10 birds in total.
      </Typography>

      <Grid container spacing={1}>
        {
          BIRD_OPTIONS.map((answer, idx) =>
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    border: '1px solid black',
                    maxWidth: '25vw'
                  },
                },
              }}
              placement='top'
              title={
                <CardMedia
                  component="img"
                  image={`/public/bird_beaks/examples/${answer}_beak_examples.jpg`}
                  className='max-w-md w-max'
                />
              }
            >
              <Grid item xs>
                <Card>
                  <CardMedia
                    component="img"
                    image={`/public/bird_beaks/example/${answer}.jpeg`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="subtitle2" component="div">{idx + 1}. {answer[0].toUpperCase() + answer.slice(1)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Tooltip>)
        }
      </Grid>

      <NextButton buttonText="Proceed to task" />

    </CenterPage >
  )
}