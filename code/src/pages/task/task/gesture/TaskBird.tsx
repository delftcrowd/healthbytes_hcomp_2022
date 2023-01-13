import { NormalizedLandmarkList } from '@mediapipe/holistic'
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import InstructionButton from 'components/atoms/InstructionButton'
import indexDescription from 'components/gestures/fingerpose'
import middleDescription from 'components/gestures/fingerpose/middle'
import pinkyDescription from 'components/gestures/fingerpose/pinky'
import ringDescription from 'components/gestures/fingerpose/ring'
import { LandmarkAggregate } from 'components/gestures/Gesture'
import { BIRD_ACTIONS_NAMES, GESTURE_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import { GestureClassifier } from 'components/healthbytes/GestureClassifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { drawOutFace } from 'components/healthbytes/OverlayEffects'
import { CenterPage } from 'components/molecules/CenterCard'
import { loadQuestion, sendAnswer, sendPose } from 'components/utils/task'
import { getCentroid, Point } from 'components/utils/utilsTS'
import { PoseAction } from 'constants/AppConstants'
import { THand } from 'kalidokit'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
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

export const TaskBird: React.FC = () => {
  const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
  const question = useSelector((state: RootState) => state.question)
  const questionRef = useRef<QuestionState>()
  const previousAnswerRef = useRef<number | undefined>(undefined)
  const answerRef = useRef<number | undefined>(undefined)
  const healthByteRef = useRef<HealthByteHandle>(null)
  const centroidsRef = useRef<Point[]>([])
  const [answer, setAnswerValue] = useState<number | undefined>(undefined)
  const dispatch = useAppDispatch()

  useEffect(() => { questionRef.current = question }, [question])

  const submitAnswer = (landmarks?: LandmarkAggregate) => {
    if (answerRef.current === undefined || answerRef.current < 1 || questionRef.current === undefined) {
      return
    }

    classifier.current.stop()
    dispatch(sendPose(PoseAction.SUBMIT, landmarks))
    dispatch(sendAnswer(questionRef.current.answers[answerRef.current - 1]))
  }

  const setAnswer = (answer: number | undefined) => {
    previousAnswerRef.current = answerRef.current
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

  const getNumberOfFingers = (v: BirdHandGesture) => {
    let numberOfFingers = 0
    if (v.handLeftGesture) {
      let gestures = GestureClassifier.classify(v.handLeftGesture)
      if (gestures !== undefined) {
        numberOfFingers += gestures.length
      }
    }
    if (v.handRightGesture) {
      let gestures = GestureClassifier.classify(v.handRightGesture)
      if (gestures !== undefined) {
        numberOfFingers += gestures.length
      }
    }

    setAnswer(numberOfFingers)
    return numberOfFingers
  }

  const getYPos = (v: { handLeft?: NormalizedLandmarkList, handRight?: NormalizedLandmarkList }) => {
    let isInTop = false
    centroidsRef.current.length = 0
    if (v.handLeft !== undefined) {
      const leftCentroid = getCentroid(v.handLeft!)
      isInTop ||= leftCentroid.y < 1 / 3
      centroidsRef.current.push(leftCentroid)
    }

    if (v.handRight !== undefined) {
      const rightCentroid = getCentroid(v.handRight!)
      isInTop ||= rightCentroid.y < 1 / 3
      centroidsRef.current.push(rightCentroid)
    }
    return isInTop
  }

  const classifier = useRef(new Classifier(
    {
      activators: [
        new GestureActivator<{ numFingers: number }>({
          name: 'fingers',
          selector: (landmarks) => ({
            numFingers: getNumberOfFingers({
              handLeftGesture: landmarks.leftHandlm,
              handRightGesture: landmarks.rightHandlm,
              handLeftRig: landmarks.leftHandRig,
              handRightRig: landmarks.rightHandRig,
            })
          }),
          activation: (v) => v.numFingers > 0,
          deactivation: (v) => v.numFingers === 0 || v.numFingers !== previousAnswerRef.current, // deactivate if current number of fingers is different than the previous number
          time: 0,
          maxMistakes: 0
        }),
        new GestureActivator<boolean>({
          name: GESTURE_NAMES.HAND_Y_POSITION,
          selector: (landmarks) => getYPos({
            handLeft: landmarks.leftHandlm,
            handRight: landmarks.rightHandlm,
          }),
          activation: (v) => v && answerRef.current !== 0,
          deactivation: (v) => !v || answerRef.current === 0,
          time: 2000,
          maxMistakes: 0
        }),
      ],
      actions: [
        new GestureAction<number>({
          name: BIRD_ACTIONS_NAMES.FINGERS,
          callback: () => { },
          onActivate: () => { },
          onDeactivate: () => { dispatch(resetCounter()) }
        }),
        new GestureAction<number>({
          name: START_STOP,
          callback: (data, landmarks) => { submitAnswer(landmarks) },
          onActivate: () => { dispatch(startCounter({ maxTime: 2 })) },
          onDeactivate: () => { dispatch(resetCounter()) }
        })
      ]
    }
  ))

  useEffect(() => {
    GestureClassifier.initialize([
      // thumbDescription, thumb detection is not very accurate, thus we ignore it
      indexDescription,
      middleDescription,
      ringDescription,
      pinkyDescription
    ])

    classifier.current.mapGesture({
      'fingers': BIRD_ACTIONS_NAMES.FINGERS,
      [GESTURE_NAMES.HAND_Y_POSITION]: START_STOP,
    })
  }, [])

  useEffect(() => {
    dispatch(loadQuestion())
      .then(() => classifier.current.start())
      .then(() => dispatch(sendPose(PoseAction.START)))
  }, [questionNumber])

  useLayoutEffect(() => {
    healthByteRef.current?.addOverlays(drawOutFace)

    healthByteRef.current?.addOverlays((canvas) => {
      const ctx = canvas.getContext("2d")
      if (ctx === null) return
      const { width, height } = canvas.getBoundingClientRect()
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'red'
      ctx.moveTo(0, height / 3)
      ctx.lineTo(width, height / 3)
      ctx.stroke()
    })

    healthByteRef.current?.addOverlays((canvas) => {
      const ctx = canvas.getContext("2d")
      if (ctx === null) return
      const { width, height } = canvas.getBoundingClientRect()
      centroidsRef.current.forEach(centroid => {
        const x = centroid.x * width
        const y = centroid.y * height
        ctx.fillStyle = 'yellow'
        ctx.fillRect(x - 4, y - 4, 8, 8)
      })
    })
  }, [healthByteRef.current])

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ hand: true }), [])

  return (
    <CenterPage>
      <Typography variant='subtitle1'>Question number {questionNumber + 1}</Typography>

      <Typography variant='body2'>Choose which category this bird beak falls into. You can use all fingers apart from the thumbs.</Typography>
      <InstructionButton>
        <ol className='list-decimal list-inside'>
          <li>Extend fingers to choose an answer (exluding thumbs).</li>
          <li>Raise hands to the top third of the camera view to confirm answer.</li>
          <li>Closing all fingers or lowering your hands will reset the countdown and allow you to change your answer.</li>
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
            <Grid item xs>
              <Card style={getActiveStyle(idx)}>
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

      <div className='w-full'>
        <HealthByte
          ref={healthByteRef}
          classifier={classifier.current}
          showConnectors={connectorOrLandmarkOptions}
          showLandmarks={connectorOrLandmarkOptions}
          className="w-1/3 mx-auto" />
        <Counter />
      </div>
    </CenterPage >
  )
}