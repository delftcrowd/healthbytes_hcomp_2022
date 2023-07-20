import { NormalizedLandmarkList } from '@mediapipe/holistic'
import { Rating, Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import InstructionButton from 'components/atoms/InstructionButton'
import fistDescription from 'components/gestures/fingerpose/fist'
import fiveDescription from 'components/gestures/fingerpose/five'
import { LandmarkAggregate } from 'components/gestures/Gesture'
import { GESTURE_NAMES, MOVIE_ACTIONS_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import { GestureClassifier } from 'components/healthbytes/GestureClassifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { drawOutFace } from 'components/healthbytes/OverlayEffects'
import { CenterPage } from 'components/molecules/CenterCard'
import { loadQuestion, sendAnswer, sendPose } from 'components/utils/task'
import { getCentroid, Point } from 'components/utils/utilsTS'
import { MOVIE_X_CLASSES, PoseAction } from 'constants/AppConstants'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
import { RootState } from 'store/store'

export interface MovieQuestion {
  question: string
}

export interface HandPositionX {
  handLeft?: NormalizedLandmarkList,
  handRight?: NormalizedLandmarkList,
}

export interface HandGesture {
  handLeftGesture?: NormalizedLandmarkList,
  handRightGesture?: NormalizedLandmarkList,
}

export const TaskMovie: React.FC = () => {
  const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
  const question = useSelector((state: RootState) => state.question)
  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)
  const healthByteRef = useRef<HealthByteHandle>(null)
  const centroidRef = useRef<Point | null>(null)
  const dispatch = useAppDispatch()

  const submitAnswer = (landmarks?: LandmarkAggregate) => {
    if (!answerRef.current) { // includes 0
      return
    }

    classifier.current.stop()
    dispatch(sendPose(PoseAction.SUBMIT, landmarks))
    dispatch(sendAnswer(answerRef.current))
  }

  const setAnswer = (answer: number) => {
    answerRef.current = answer
    setAnswerValue(answer)
  }

  const getXClass = (v: HandPositionX) => {
    const leftHandVisible = v.handLeft !== undefined
    const rightHandVisible = v.handRight !== undefined

    centroidRef.current = null
    // bothHands include both hidden or both visible
    const bothHands = leftHandVisible === rightHandVisible
    if (bothHands) return 0

    const centroid = (leftHandVisible ? getCentroid(v.handLeft!) : getCentroid(v.handRight!))

    const x = centroid.x ?? -1
    centroidRef.current = centroid

    const classRange = Math.floor(x / (1 / MOVIE_X_CLASSES)) + 1
    const result = (classRange < 0 || classRange > MOVIE_X_CLASSES) ? 0 : classRange
    setAnswer(result)
    return result
  }

  const classifier = useRef(new Classifier(
    {
      activators: [
        new GestureActivator<number>({
          name: GESTURE_NAMES.HAND_X_POSITION,
          selector: (landmarks) => getXClass({
            handLeft: landmarks.leftHandlm,
            handRight: landmarks.rightHandlm,
          }),
          activation: (v) => v > 0 && v <= MOVIE_X_CLASSES,
          deactivation: (v) => v === 0,
          time: 0,
          maxMistakes: 0
        }),
        new GestureActivator<HandGesture>({
          name: GESTURE_NAMES.HAND_GESTURES.FIVE,
          selector: (landmarks) => ({ handLeftGesture: landmarks.leftHandlm, handRightGesture: landmarks.rightHandlm }),
          activation: (v) => {
            if (answerRef.current === 0) {
              return false
            }
            const bothHands = (v.handLeftGesture !== undefined) === (v.handRightGesture !== undefined)

            if (bothHands) {
              setAnswer(0)
              return false
            }
            const gesture = v.handLeftGesture ? v.handLeftGesture! : v.handRightGesture!

            let gestures = GestureClassifier.classify(gesture)
            return (gestures !== undefined && gestures.length > 0 && gestures[0].name == "five")
          },
          deactivation: (v) => {
            const bothHands = (v.handLeftGesture !== undefined) === (v.handRightGesture !== undefined)

            if (bothHands) {
              setAnswer(0)
              return true
            }
            const gesture = v.handLeftGesture ? v.handLeftGesture! : v.handRightGesture!

            let gestures = GestureClassifier.classify(gesture)
            return (gestures !== undefined && gestures.length > 0 && gestures[0].name == "fist")
          },
          time: 2000,
          maxMistakes: 2
        })
      ],
      actions: [
        new GestureAction<number>({
          name: MOVIE_ACTIONS_NAMES.RATING1,
          callback: () => { },
          onActivate: () => { },
          onDeactivate: () => { }
        }),
        new GestureAction<number>({
          name: START_STOP,
          callback: (data, landmarks) => { submitAnswer(landmarks) },
          onActivate: () => { dispatch(startCounter({ maxTime: 2 })) },
          onDeactivate: () => {
            dispatch(resetCounter())
          }
        })
      ]
    }
  ))

  useEffect(() => {
    GestureClassifier.initialize([
      fiveDescription,
      fistDescription
    ])

    classifier.current.mapGesture({
      [GESTURE_NAMES.HAND_X_POSITION]: MOVIE_ACTIONS_NAMES.RATING1,
      [GESTURE_NAMES.HAND_GESTURES.FIVE]: START_STOP,
    })
  }, [])

  useEffect(() => {
    dispatch(loadQuestion())
      .then(() => classifier.current.start())
      .then(() => dispatch(sendPose(PoseAction.START)))

  }, [questionNumber])

  useLayoutEffect(() => {
    // healthByteRef.current?.addOverlays(drawOutFace)

    healthByteRef.current?.addOverlays((canvas) => {
      const ctx = canvas.getContext("2d")
      if (ctx === null) return
      const { width, height } = canvas.getBoundingClientRect()
      const sectionWidth = width / MOVIE_X_CLASSES
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'red'
      for (let x = 1; x < MOVIE_X_CLASSES; ++x) {
        ctx.moveTo(x * sectionWidth, 0)
        ctx.lineTo(x * sectionWidth, height)
        ctx.stroke()
      }
    })

    healthByteRef.current?.addOverlays((canvas) => {
      const ctx = canvas.getContext("2d")
      if (ctx === null) return
      const { width, height } = canvas.getBoundingClientRect()
      if (centroidRef.current) {
        const centroid = centroidRef.current
        const x = centroid.x * width
        const y = centroid.y * height
        ctx.fillStyle = 'yellow'
        ctx.fillRect(x - 4, y - 4, 8, 8)
      }
    })
  }, [healthByteRef.current])

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ hand: true }), [])

  return (
    <CenterPage>
      <Typography variant='h6'>Question number {questionNumber + 1}</Typography>
      <InstructionButton>
        <ol className='list-decimal list-inside'>
          <li>Form a fist and move it left/right to select a rating.</li>
          <li>Open fist to confirm rating.</li>
          <li>Closing the fist will reset the countdown and allow you to change your answer.</li>
        </ol>
      </InstructionButton>
      <Typography variant='body1'>{question.question}</Typography>

      <Rating name="Rating" value={answer} size="large" readOnly />

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