import { Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import InstructionButton from 'components/atoms/InstructionButton'
import { LandmarkAggregate } from 'components/gestures/Gesture'
import { ACTIONS_NAMES, GESTURE_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { drawOutFace } from 'components/healthbytes/OverlayEffects'
import { CenterPage } from 'components/molecules/CenterCard'
import { loadQuestion, sendAnswer, sendPose } from 'components/utils/task'
import { PoseAction } from 'constants/AppConstants'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
import { setNotification } from 'store/slices/notificationSlice'
import { QuestionState } from 'store/slices/questionSlice'
import { RootState } from 'store/store'

export interface PersonQuestion {
  question: string,
  option1: string,
  option2: string
}

export const TaskPerson: React.FC<{ taskType: string }> = ({ taskType, ...props }) => {
  const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
  const question = useSelector((state: RootState) => state.question)
  const questionRef = useRef<QuestionState>()
  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)
  const healthByteRef = useRef<HealthByteHandle>(null)
  const dispatch = useAppDispatch()

  useEffect(() => { questionRef.current = question }, [question])


  const submitAnswer = (landmarks?: LandmarkAggregate) => {
    if (!questionRef.current) {
      return
    }

    if (!answerRef.current) { // includes answer 0
      dispatch(setNotification({
        message: `No answer was selected`,
        severity: 'warning'
      }))
      return
    }

    classifier.current.stop()
    dispatch(sendPose(PoseAction.SUBMIT, landmarks))
    switch (answerRef.current) {
      case 1:
        dispatch(sendAnswer(questionRef.current.answers[0]))
        break
      case 2:
        dispatch(sendAnswer(questionRef.current.answers[1]))
        break
    }

    // reset the answer
    setAnswer(0)
  }

  const setAnswer = (answer: number) => {
    answerRef.current = answer
    setAnswerValue(answer)
  }

  const getActiveStyle = (option: number) => {
    if (answerRef.current - 1 === option) {
      return 'red'
    }
    return 'inherit'
  }

  const classifier = useRef(new Classifier(
    {
      activators: [
        new GestureActivator<number>({
          name: GESTURE_NAMES.HEAD_ROLL.LEFT,
          selector: (landmarks) => landmarks.faceRig?.head.degrees.z,
          activation: (v) => v > 35,
          deactivation: (v) => v < 25,
          time: 0,
          maxMistakes: 0
        }),
        new GestureActivator<number>({
          name: GESTURE_NAMES.HEAD_ROLL.RIGHT,
          selector: (landmarks) => landmarks.faceRig?.head.degrees.z,
          activation: (v) => v < -35,
          deactivation: (v) => v > -25,
          time: 0,
          maxMistakes: 0
        }),
        new GestureActivator<number>({
          name: GESTURE_NAMES.HEAD_PITCH,
          selector: (landmarks) => landmarks.faceRig?.head.degrees.x,
          activation: (v) => v < -30,
          deactivation: (v) => v > -20,
          time: 2000,
          maxMistakes: 0
        }),
      ],
      actions: [
        new GestureAction<number>({
          name: ACTIONS_NAMES.OPTION1,
          callback: () => { setAnswer(1) },
          onActivate: () => { },
          onDeactivate: () => { }
        }),
        new GestureAction<number>({
          name: ACTIONS_NAMES.OPTION2,
          callback: () => { setAnswer(2) },
          onActivate: () => { },
          onDeactivate: () => { }
        }),
        new GestureAction<number>({
          name: START_STOP,
          callback: () => {
            submitAnswer()
            dispatch(resetCounter())
          },
          onActivate: () => { dispatch(startCounter({ maxTime: 2 })) },
          onDeactivate: () => { dispatch(resetCounter()) }
        })
      ]
    }
  ))

  useEffect(() => {
    classifier.current.mapGesture({
      [GESTURE_NAMES.HEAD_ROLL.LEFT]: ACTIONS_NAMES.OPTION1,
      [GESTURE_NAMES.HEAD_ROLL.RIGHT]: ACTIONS_NAMES.OPTION2,
      [GESTURE_NAMES.HEAD_PITCH]: START_STOP,
    })
  }, [])

  useEffect(() => {
    dispatch(loadQuestion())
      .then(() => classifier.current.start())
      .then(() => dispatch(sendPose(PoseAction.START)))

  }, [questionNumber])

  useLayoutEffect(() => {
    // healthByteRef.current?.addOverlays(drawOutFace)
  }, [healthByteRef.current])

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ body: true }), [])

  return (
    <CenterPage>
      <Typography variant='subtitle1'>Question number {taskType == 'profession' ? questionNumber + 6 : questionNumber + 1}</Typography>
      <Typography variant='h5'>{question.question}</Typography>

      <InstructionButton>
        <ol className='list-decimal list-inside'>
          <li>Use any search tool at your disposal to answer the questions; e.g. Google search (or any search engine) in a new tab or window.</li>
          <li>Tilt your head left or right to choose an answer.</li>
          <li>Nod to confirm and submit your chosen answer.</li>
        </ol>
      </InstructionButton>

      <div className='flex flex-row justify-around w-full'>
        {question.answers.map((answer, idx) =>
          <Typography variant='h6' key={answer} color={getActiveStyle(idx)}>{answer}</Typography>
        )}
      </div>

      <HealthByte
        ref={healthByteRef}
        classifier={classifier.current}
        showConnectors={connectorOrLandmarkOptions}
        showLandmarks={connectorOrLandmarkOptions}
        className="w-1/2 mx-auto" />
      <Counter />
    </CenterPage>
  )
}