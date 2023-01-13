import { Rating, Typography } from '@mui/material'
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from 'components/molecules/CenterCard'


export const TutorialMovieNormal = () => {
  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>
        In the following questions, you will be presented with a review of a film or TV show. After reading each review, you will be asked to assign a star rating you think best matches the content of the review. The star ratings can be 1 to 5 stars, with no option of half stars. An example of the rating input is shown below. To determine the appropriate star rating, be sure to consider the sentiment of the review (e.g., written with positive, negative, or neutral language). In total, you will be presented with 10 reviews.
      </Typography>

      <Rating name="Rating" size="large" />

      <NextButton buttonText="Proceed to task" />

    </CenterPage>
  )
}