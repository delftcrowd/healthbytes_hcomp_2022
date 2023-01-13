import { Button, Typography } from '@mui/material'
import InstructionButton from 'components/atoms/InstructionButton'
import { CenterPage } from 'components/molecules/CenterCard'
import { loadQuestion, sendAnswer, sendPose } from 'components/utils/task'
import { PoseAction } from 'constants/AppConstants'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setNotification } from 'store/slices/notificationSlice'
import { QuestionState } from 'store/slices/questionSlice'
import { RootState } from 'store/store'

export interface PersonQuestion {
  question: string,
  option1: string,
  option2: string
}

export const TaskPersonNormal: React.FC<{ taskType: string }> = ({ taskType, ...props }) => {
  const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
  const question = useSelector((state: RootState) => state.question)
  const questionRef = useRef<QuestionState>()
  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)
  const dispatch = useAppDispatch()

  useEffect(() => { questionRef.current = question }, [question])

  const setAnswer = (value: number) => {
    answerRef.current = value
    setAnswerValue(value)
  }

  const submitAnswer = () => {
    if (!questionRef.current) {
      return
    }

    switch (answerRef.current) {
      case 1:
        dispatch(sendAnswer(questionRef.current.answers[0]))
        break
      case 2:
        dispatch(sendAnswer(questionRef.current.answers[1]))
        break
      default:
        dispatch(setNotification({
          message: `No answer was selected`,
          severity: 'warning'
        }))
    }
    setAnswer(0)
  }


  useEffect(() => {
    dispatch(loadQuestion())
      .then(() => dispatch(sendPose(PoseAction.START)))
  }, [questionNumber])

  return (
    <CenterPage>
      <Typography variant='subtitle1'>Question number {taskType == 'profession' ? questionNumber + 6 : questionNumber + 1}</Typography>
      <Typography variant='h5'>{question.question}</Typography>

      <InstructionButton>
        <ol className='list-decimal list-inside'>
          <li>Use any search tool at your disposal to answer the questions; e.g. Google search (or any search engine) in a new tab or window.</li>
          <li>Once you have found the answer, press its button and then press 'Submit answer'.</li>
        </ol>
      </InstructionButton>

      <div className='flex flex-row justify-around w-full'>
        {question.answers.map((a, index) =>
          <Button
            key={a}
            variant={(answer === index + 1) ? 'outlined' : 'text'}
            size='large'
            color='info'
            onClick={() => setAnswer(index + 1)}>{a}</Button>
        )}
      </div>

      <Button
        variant='contained'
        color='info'
        size='large'
        disabled={!answer}
        onClick={submitAnswer}
      >Submit answer</Button>
    </CenterPage>
  )
}