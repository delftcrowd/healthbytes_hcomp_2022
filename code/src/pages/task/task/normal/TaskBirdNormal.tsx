import { NormalizedLandmarkList } from '@mediapipe/holistic'
import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import InstructionButton from 'components/atoms/InstructionButton'
import { CenterPage } from 'components/molecules/CenterCard'
import { loadQuestion, sendAnswer, sendPose } from 'components/utils/task'
import { PoseAction } from 'constants/AppConstants'
import { THand } from 'kalidokit'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { QuestionState } from 'store/slices/questionSlice'
import { RootState } from 'store/store'

export interface BirdQuestion {
  question: string
}

export interface BirdHandGesture {
  handLeftGesture?: NormalizedLandmarkList,
  handRightGesture?: NormalizedLandmarkList,
  handLeftRig?: THand<'Left'>,
  handRightRig?: THand<'Right'>,
}

export const TaskBirdNormal: React.FC = () => {
  const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
  const question = useSelector((state: RootState) => state.question)
  const questionRef = useRef<QuestionState>()
  const answerRef = useRef<number | undefined>(undefined)
  const [answer, setAnswerValue] = useState<number | undefined>(undefined)
  const dispatch = useAppDispatch()

  useEffect(() => { questionRef.current = question }, [question])

  const submitAnswer = () => {
    if (answerRef.current === undefined || answerRef.current < 1 || questionRef.current === undefined) {
      return
    }

    dispatch(sendPose(PoseAction.SUBMIT))
    dispatch(sendAnswer(questionRef.current.answers[answerRef.current - 1]))
    setAnswer(0)
  }

  const setAnswer = (answer: number | undefined) => {
    answerRef.current = answer
    setAnswerValue(answer)
  }

  const getActiveStyle = (cardIndex: number) => {
    if (answerRef.current !== undefined && answerRef.current - 1 === cardIndex) {
      return {
        border: '3px solid red',
        transform: 'scale(1.2, 1.2)!important'
      }
    }
    return {}
  }

  useEffect(() => {
    dispatch(loadQuestion())
      .then(() => dispatch(sendPose(PoseAction.START)))

  }, [questionNumber])


  return (
    <CenterPage>
      <Typography variant='subtitle1'>Question number {questionNumber + 1}</Typography>

      <InstructionButton>
        <ol className='list-decimal list-inside'>
          <li>Choose which category you think the shown bird beak falls into by pressing the corresponding card.</li>
          <li>Once you have chosen your answer, press 'Submit answer'.</li>
        </ol>
      </InstructionButton>
      <Card className='max-w-sm max-h-[30vh]'>
        <CardMedia
          component="img"
          image={`/public/${question.question}`}
          className='object-cover w-full h-full'
        />
      </Card>
      <Grid container spacing={1}>
        {
          question.answers.map((answer, idx) =>
            <Grid item xs key={answer}>
              <Card style={getActiveStyle(idx)} onClick={() => setAnswer(idx + 1)}>
                <CardMedia
                  component="img"
                  image={`/public/bird_beaks/example/${answer}.jpeg`}
                />
                <CardContent>
                  <Typography gutterBottom variant="subtitle2" component="div">{idx + 1}.{answer}</Typography>
                </CardContent>
              </Card>
            </Grid>)
        }
      </Grid>

      <Button
        variant='contained'
        color='info'
        size='large'
        disabled={!answer}
        onClick={submitAnswer}
      >Submit answer</Button>

    </CenterPage >
  )
}