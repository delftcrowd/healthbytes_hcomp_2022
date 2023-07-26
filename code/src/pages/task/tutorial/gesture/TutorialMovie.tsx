import { Button, Rating, Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import { NextButton } from "components/atoms/NextButton"
import fistDescription from 'components/gestures/fingerpose/fist'
import fiveDescription from 'components/gestures/fingerpose/five'
import { GESTURE_NAMES, MOVIE_ACTIONS_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import { GestureClassifier } from 'components/healthbytes/GestureClassifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { drawOutFace } from 'components/healthbytes/OverlayEffects'
import { CenterPage } from 'components/molecules/CenterCard'
import { getCentroid, Point } from 'components/utils/utilsTS'
import { MOVIE_X_CLASSES } from 'constants/AppConstants'
import { HandGesture, HandPositionX } from 'pages/task/task/gesture/TaskMovie'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
import { setNotification } from 'store/slices/notificationSlice'


export const TutorialMovie = () => {

  const dispatch = useAppDispatch()
  const [step, setStep] = useState(0)
  const stage = useRef(0)

  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)
  const healthByteRef = useRef<HealthByteHandle>(null)
  const centroidRef = useRef<Point | null>(null)
  const activatedAnswers = useRef<boolean[]>([false, false, false, false, false, false])

  const proceed = (nextStep: number) => {
    if (nextStep === stage.current + 1) {
      if (nextStep === 3) {
        classifier.current.reset()
      }
      stage.current = nextStep
      setStep(nextStep)
    } else {
      console.log('wrong gesture')
    }
  }

  const submitAnswer = () => {
    if (!answerRef.current) { // includes 0
      return
    }

    switch (stage.current) {
      case 2:
        if (answerRef.current === 4) {
          proceed(3)
        } else {
          dispatch(setNotification({ message: "That's the wrong rating, try again!", severity: "warning" }))
        }
        break
      case 3:
        if (answerRef.current === 1) {
          proceed(4)
        } else {
          dispatch(setNotification({ message: "That's the wrong rating, try again!", severity: "warning" }))
        }
        break
    }
  }

  const setAnswer = (answer: number) => {
    answerRef.current = answer
    setAnswerValue(answer)
    activatedAnswers.current[answer] = true
    if (stage.current === 1 && !activatedAnswers.current.some(x => !x)) {
      proceed(2)
    }
  }

  const deactivation = () => {
    dispatch(resetCounter())
    classifier.current.getActivator(GESTURE_NAMES.HAND_GESTURES.FIVE).reset()
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
          maxMistakes: 2
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
          onDeactivate: () => {
            deactivation()
          }
        }),
        new GestureAction<number>({
          name: START_STOP,
          callback: () => { submitAnswer() },
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

  const getCurrentText = () => {
    switch (step) {
      case 0: return <>In the following questions, you will be presented with a review of a film or TV show. After reading each review, you will be asked to assign a star rating you think best matches the content of the review. The star ratings can be 1 to 5 stars, with no option of half stars. To determine the appropriate star rating, be sure to consider the sentiment of the review (e.g., written with positive, negative, or neutral language). In total, you will be presented with 10 reviews.</>
      case 1: return <>To select an answer, hold up one hand into a fist with your fingers facing the screen and move it left and right of the camera. <br /> The stars will change according to the hand's position (represented by the yellow square) in the camera view (split in sections by the red lines). Try selecting all possible values at least once. Make sure that the whole hand is always visible, otherwise the gesture detection can be unreliable.</>
      case 2: return <>Well done! Now select 4 stars and then open your fingers out into a high five without moving your hand's position (keeping the stars on 4).<br />This will start a 2 second countdown and once it has ended, your chosen answer will be submitted.</>
      case 3: return <>That was awesome! Now try the same by submitting a rating of 1 star! You can use your left hand if it is more convenient.</>
      case 4: return <>Tutorial complete! Please note the following:<br />
        1. The countdown is there to confirm your answer and not to indicate a time limit.<br />
        2. Changing your rating or closing your hand before the countdown has ended will reset the countdown.<br />
        3. You can use both the left and right hand, but you need to have only one hand in view at one time. If both are visible, the countdown won't start.<br />
        4. You don't need to have the hand up all the time. You can keep them down and hold one up only when you're ready to submit a rating.<br />
        5. It might take a couple seconds for the hand position to be recognised, please be patient.<br />
        The instructions will be available throughout the tasks by pressing the 'Instructions' button in the top right.
        <br /><br />
        You can now proceed to the task.</>
    }
  }

  const renderSwitch = (step: number) => {
    switch (step) {
      case 0:
        return <Button variant='contained' onClick={() => proceed(1)} sx={{ marginTop: '1em' }} color={'success'}>Next</Button>
      case 1:
      case 2:
      case 3:
        return <>
          <Rating name="Rating" value={answer} size="large" readOnly />
          <HealthByte
            ref={healthByteRef}
            classifier={classifier.current}
            showConnectors={connectorOrLandmarkOptions}
            showLandmarks={connectorOrLandmarkOptions}
            className="w-1/2 mx-auto" />
          <Counter />
        </>
      case 4:
        return <NextButton buttonText="Next" />
      default:
        return null
    }
  }

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ hand: true }), [])

  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>{getCurrentText()}</Typography>
      {renderSwitch(step)}
    </CenterPage>
  )
}