import { Button, Grid, Rating, Typography } from '@mui/material'
import InstructionButton from 'components/atoms/InstructionButton'
import EndOptionalTaskButton from 'components/atoms/EndOptionalTasks'
import { CenterPage } from 'components/molecules/CenterCard'
import { loadQuestion, sendAnswer, sendPose } from 'components/utils/task'
import { PoseAction } from 'constants/AppConstants'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { RootState } from 'store/store'

export interface MovieQuestion {
  question: string
}

export const TaskMovieNormal: React.FC = () => {
  const optedForOptional = useAppSelector((state: RootState) => state.task.optedForOptional)
  const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
  const question = useSelector((state: RootState) => state.question)
  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)
  const dispatch = useAppDispatch()

  const submitAnswer = () => {
    if (!answerRef.current) { // includes 0
      return
    }

    // dispatch(sendPose(PoseAction.SUBMIT))
    dispatch(sendAnswer(answerRef.current))
    answerRef.current = 0
    setAnswerValue(0)
  }

  const setAnswer = (event: React.SyntheticEvent, value: number | null) => {
    if (value !== null) {
      answerRef.current = value
      setAnswerValue(value)
    }
  }

  useEffect(() => {
    dispatch(loadQuestion())
      .then(() => dispatch(sendPose(PoseAction.START)))

  }, [questionNumber])

  return (
    <CenterPage>
      <Typography variant='subtitle1'>Question number {questionNumber + 1}</Typography>
      <Typography variant='body1'>{question.question}</Typography>

      <InstructionButton>
        <ol className='list-decimal list-inside'>
          <li>Assign a star rating you think best matches the review.</li>
          <li>The star ratings can be 1 to 5 stars, with no option of half stars.</li>
          <li>Once you have chosen your answer, press 'Submit answer'.</li>
        </ol>
      </InstructionButton>

      <Rating name="Rating" value={answer} size='large' onChange={setAnswer} />
      {optedForOptional ? <>
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          <Grid item xs={2}>
            <EndOptionalTaskButton />
          </Grid>
          <Grid item xs={2}>
            <Button 
              variant='contained'
              color='info'
              size='large'
              disabled={!answer}
              onClick={submitAnswer}
            >Submit answer</Button>
          </Grid>
        </Grid></> :
      <Button 
        variant='contained'
        color='info'
        size='large'
        disabled={!answer}
        onClick={submitAnswer}
      >Submit answer</Button>}
    </CenterPage>
  )
}