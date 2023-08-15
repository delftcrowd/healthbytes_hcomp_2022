import { NormalizedLandmarkList } from '@mediapipe/holistic'
import { Button, Card, CardContent, CardMedia, Grid, Tooltip, Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import { NextButton } from "components/atoms/NextButton"
import indexDescription from 'components/gestures/fingerpose'
import middleDescription from 'components/gestures/fingerpose/middle'
import pinkyDescription from 'components/gestures/fingerpose/pinky'
import ringDescription from 'components/gestures/fingerpose/ring'
import { BIRD_ACTIONS_NAMES, GESTURE_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import { GestureClassifier } from 'components/healthbytes/GestureClassifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { drawOutFace } from 'components/healthbytes/OverlayEffects'
import { CenterPage } from 'components/molecules/CenterCard'
import { getCentroid, Point } from 'components/utils/utilsTS'
import { BIRD_OPTIONS } from 'constants/AppConstants'
import { BirdHandGesture } from 'pages/task/task/gesture/TaskBird'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
import { setNotification } from 'store/slices/notificationSlice'


export const TutorialBird = () => {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(0)
  const stage = useRef(0)
  const previousAnswerRef = useRef<number>(0)
  const answerRef = useRef<number>(0)
  const healthByteRef = useRef<HealthByteHandle>(null)
  const centroidsRef = useRef<Point[]>([])
  const [answer, setAnswerValue] = useState<number>(0)

  const proceed = (nextStep: number) => {
    if (nextStep === stage.current + 1) {
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
      case 1: {
        if (answerRef.current === 5) {
          proceed(2)
        } else {
          dispatch(setNotification({ message: "That's the wrong option, try again!", severity: 'warning' }))
        }
        break
      }
      case 2: {
        if (answerRef.current === 8) {
          proceed(3)
        } else {
          dispatch(setNotification({ message: "That's the wrong option, try again!", severity: 'warning' }))
        }
        break
      }
    }
  }

  const setAnswer = (answer: number) => {
    previousAnswerRef.current = answerRef.current
    answerRef.current = answer
    setAnswerValue(answer)
  }

  const getActiveStyle = (cardIndex: number) => {
    if (answerRef.current - 1 === cardIndex) {
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
          deactivation: (v) => v.numFingers === 0 || v.numFingers !== previousAnswerRef.current,
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
          callback: () => { submitAnswer() },
          onActivate: () => { dispatch(startCounter({ maxTime: 2 })) },
          onDeactivate: () => { dispatch(resetCounter()) }
        })
      ]
    }
  ))

  useEffect(() => {
    GestureClassifier.initialize([
      // thumbDescription,
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

  useLayoutEffect(() => {
    // healthByteRef.current?.addOverlays(drawOutFace)

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

  const getCurrentText = () => {
    switch (step) {
      case 0: return <>In the following questions, you'll be presented with the image of a bird and asked to identify what type of beak it has, based on the beak shape. To help you familiarize with the names of the various shapes, we've provided a primer for the different variations that you can visualise by hovering over each card. Please study this primer and familiarize yourself with the different shapes birds' beaks can take, and how they are named. Later, you will be asked to identify the beak of 10 birds in total.</>
      case 1: return <>To select an answer, first hold up both your hands into a fist with your fingers facing the screen and keep the hands in the bottom half of the camera view.<br />
        Then choose one of the birds by raising the corresponding number of fingers. To confirm your answer, raise and hold one or both your hands, marked with a yellow square, to the top third of the camera view, marked with a red line (whilst keeping all the raised fingers still in view). This will start a countdown, after which your answer will be submitted.<br /> You can ONLY use your index to pinky finger, so the THUMB is NOT counted! Now use your fingers to choose and submit the bird number 5.</>
      case 2: return <>Well done! Now choose the bird number 8 and submit your answer.</>
      case 3: return <>Tutorial complete! Please note the following:<br />
        1. The countdown is there to confirm your answer and not to indicate a time limit.<br />
        2. Changing the number of fingers, closing your hands or moving your hands down before the countdown has ended will reset the countdown.<br />
        3. You can use one or both the left and right hand.<br />
        4. You don't need to have the hands in the camera view all the time. You can keep them out of view and hold them up only when you're ready to select and submit an answer.<br />
        5. It might take a couple seconds initially for the hand position to be recognised, please be patient.<br />
        The instructions will be available throughout the tasks by pressing the 'Instructions' button in the top right.
        {/* If the detection is not very accurate, make sure that the hands are clearly visible in the camera view. */}
        <br /><br />
        You can now proceed to the task.</>
    }
  }

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ hand: true }), [])

  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>{getCurrentText()}</Typography>

      {step === 1 || step === 2 ? <>
        <HealthByte
          ref={healthByteRef}
          classifier={classifier.current}
          showConnectors={connectorOrLandmarkOptions}
          showLandmarks={connectorOrLandmarkOptions}
          className="w-1/2 mx-auto" />
        <Counter /></> : null}
      {step !== 3 ?
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
                key={answer}
              >
                <Grid item xs>
                  <Card style={getActiveStyle(idx)}>
                    <CardMedia
                      component="img"
                      image={`/public/bird_beaks/example/${answer}.jpeg`}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="subtitle2" component="div">{idx + 1}. {answer[0].toUpperCase() + answer.slice(1)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Tooltip>
            )
          }
        </Grid> : null}
      {step === 0 ? <Button variant='contained' onClick={() => proceed(1)} sx={{ marginTop: '1em' }} color={'success'}>Next</Button> : null}
      {step === 3 ? <NextButton buttonText="Next" /> : null}
    </CenterPage >
  )
}