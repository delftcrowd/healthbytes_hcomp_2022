import { Typography } from '@mui/material'
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from 'components/molecules/CenterCard'


export const TutorialPersonNormal = () => {
  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>
        In the following questions, you will be provided with the first and last name of a person. You will then need to find either the middle name or the profession of the individual shown. Use any search tool at your disposal to answer the questions; e.g. Google search (or any search engine) in a new tab or window. Once you have found the information, please select it from the list of available options. In total, you will be presented with 10 questions.
      </Typography>

      <NextButton buttonText="Proceed to task" />

    </CenterPage>
  )
}