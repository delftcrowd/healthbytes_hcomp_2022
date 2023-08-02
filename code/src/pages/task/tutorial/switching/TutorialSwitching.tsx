import { NormalizedLandmarkList } from '@mediapipe/holistic'
import { Card, CardContent, CardMedia, Grid, Tooltip, Button, Rating, Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import { NextButton } from "components/atoms/NextButton"
import fistDescription from 'components/gestures/fingerpose/fist'
import fiveDescription from 'components/gestures/fingerpose/five'
import indexDescription from 'components/gestures/fingerpose'
import middleDescription from 'components/gestures/fingerpose/middle'
import pinkyDescription from 'components/gestures/fingerpose/pinky'
import ringDescription from 'components/gestures/fingerpose/ring'
import { BIRD_ACTIONS_NAMES, GESTURE_NAMES, MOVIE_ACTIONS_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import { GestureClassifier } from 'components/healthbytes/GestureClassifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { CenterPage } from 'components/molecules/CenterCard'
import { getCentroid, Point } from 'components/utils/utilsTS'
import { MOVIE_X_CLASSES, BIRD_OPTIONS } from 'constants/AppConstants'
import { HandGesture, HandPositionX } from 'pages/task/task/gesture/TaskMovie'
import { BirdHandGesture } from 'pages/task/task/gesture/TaskBird'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
import { setNotification } from 'store/slices/notificationSlice'


export const TutorialSwitching = () => {

  const dispatch = useAppDispatch()
  const [step, setStep] = useState(0)
  const stage = useRef(0)
  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)

  const movieHealthByteRef = useRef<HealthByteHandle>(null)
  const centroidRef = useRef<Point | null>(null)
  const activatedAnswers = useRef<boolean[]>([false, false, false, false, false, false])

  const birdHealthByteRef = useRef<HealthByteHandle>(null)
  const previousAnswerRef = useRef<number>(0)
  const centroidsRef = useRef<Point[]>([])

  // ===============================================================================================
  // SHARED UTILS
  // ===============================================================================================

  const proceed = (nextStep: number) => {
    if (nextStep === stage.current + 1) {
      switch(nextStep) {
        case 2:
          GestureClassifier.initialize([
            fiveDescription,
            fistDescription
          ])
      
          movieClassifier.current.mapGesture({
            [GESTURE_NAMES.HAND_X_POSITION]: MOVIE_ACTIONS_NAMES.RATING1,
            [GESTURE_NAMES.HAND_GESTURES.FIVE]: START_STOP,
          })
          break
        case 4:
          movieClassifier.current.reset()
          break
        case 6:
          answerRef.current = 0
          GestureClassifier.reset()
          break
        case 7:
          GestureClassifier.initialize([
            indexDescription,
            middleDescription,
            ringDescription,
            pinkyDescription
          ])

          birdClassifier.current.mapGesture({
            'fingers': BIRD_ACTIONS_NAMES.FINGERS,
            [GESTURE_NAMES.HAND_Y_POSITION]: START_STOP,
          })
      }

      stage.current = nextStep
      setStep(nextStep)
    } else {
      console.log('wrong gesture')
    }
  }

  const setAnswer = (answer: number) => {
    if ([2, 3, 4].includes(stage.current)) {
      activatedAnswers.current[answer] = true
      if (stage.current === 2 && !activatedAnswers.current.some(x => !x)) {
        proceed(3)
      }
    }

    if ([8, 9].includes(stage.current)) {
      previousAnswerRef.current = answerRef.current
    }
    
    answerRef.current = answer
    setAnswerValue(answer)
  }

  // ===============================================================================================
  // BIRD GESTURE CLASSIFIER
  // ===============================================================================================

  const submitBirdAnswer = () => {
    if (!answerRef.current) { // includes 0
      return
    }

    switch (stage.current) {
      case 8: {
        if (answerRef.current === 5) {
          proceed(9)
        } else {
          dispatch(setNotification({ message: "That's the wrong option, try again!", severity: 'warning' }))
        }
        break
      }
      case 9: {
        if (answerRef.current === 8) {
          proceed(10)
        } else {
          dispatch(setNotification({ message: "That's the wrong option, try again!", severity: 'warning' }))
        }
        break
      }
    }
  }

  const getActiveStyle = (cardIndex: number) => {
    if (step === 8 || step === 9) {
      if (answerRef.current - 1 === cardIndex) {
        return {
          border: '3px solid red',
          transform: 'scale(1.2, 1.2)!important'
        }
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

  const birdClassifier = useRef(new Classifier(
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
          callback: () => { submitBirdAnswer() },
          onActivate: () => { dispatch(startCounter({ maxTime: 2 })) },
          onDeactivate: () => { dispatch(resetCounter()) }
        })
      ]
    }
  ))

  // ===============================================================================================
  // MOVIE GESTURE CLASSIFIER
  // ===============================================================================================

  const submitMovieAnswer = () => {
    if (!answerRef.current) { // includes 0
      return
    }

    switch (stage.current) {
      case 3:
        if (answerRef.current === 4) {
          proceed(4)
        } else {
          dispatch(setNotification({ message: "That's the wrong rating, try again!", severity: "warning" }))
        }
        break
      case 4:
        if (answerRef.current === 1) {
          proceed(5)
        } else {
          dispatch(setNotification({ message: "That's the wrong rating, try again!", severity: "warning" }))
        }
        break
    }
  }

  const movieDeactivation = () => {
    dispatch(resetCounter())
    movieClassifier.current.getActivator(GESTURE_NAMES.HAND_GESTURES.FIVE).reset()
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

  const movieClassifier = useRef(new Classifier(
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
            movieDeactivation()
          }
        }),
        new GestureAction<number>({
          name: START_STOP,
          callback: () => { submitMovieAnswer() },
          onActivate: () => { dispatch(startCounter({ maxTime: 2 })) },
          onDeactivate: () => {
            dispatch(resetCounter())
          }
        })
      ]
    }
  ))
  
  // ===============================================================================================
  // COMPONENT FUNCTIONALITY
  // ===============================================================================================

  useEffect(() => {
    movieHealthByteRef.current?.addOverlays((canvas) => {
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

    movieHealthByteRef.current?.addOverlays((canvas) => {
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

    // Bird classifier
    birdHealthByteRef.current?.addOverlays((canvas) => {
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

    birdHealthByteRef.current?.addOverlays((canvas) => {
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

  }, [movieHealthByteRef.current, birdHealthByteRef.current])

  const getCurrentText = () => {
    switch (step) {
      case 0: return <>In the following questions, you will potentially be presented with a review of a film or TV show. After reading each review, you will be asked to assign a star rating you think best matches the content of the review. The star ratings can be 1 to 5 stars, with no option of half stars. An example of the rating input is shown below. To determine the appropriate star rating, be sure to consider the sentiment of the review (e.g., written with positive, negative, or neutral language).</>
      case 1: return <>It is possible you will be asked to use web cam gestures to assign a star rating you think best matches the content of the review. To familiarize you with this process, we have created a simple tutorial for you. Click "Next" to launch the tutorial.</>
      case 2: return <>To select an answer, hold up one hand into a fist with your fingers facing the screen and move it left and right of the camera. <br /> The stars will change according to the hand's position (represented by the yellow square) in the camera view (split in sections by the red lines). Try selecting all possible values at least once. Make sure that the whole hand is always visible, otherwise the gesture detection can be unreliable.</>
      case 3: return <>Well done! Now select 4 stars and then open your fingers out into a high five without moving your hand's position (keeping the stars on 4).<br />This will start a 2 second countdown and once it has ended, your chosen answer will be submitted.</>
      case 4: return <>That was awesome! Now try the same by submitting a rating of 1 star! You can use your left hand if it is more convenient.</>
      case 5: return <>And that's how it's done! Please note the following:<br />
        1. The countdown is there to confirm your answer and not to indicate a time limit.<br />
        2. Changing your rating or closing your hand before the countdown has ended will reset the countdown.<br />
        3. You can use both the left and right hand, but you need to have only one hand in view at one time. If both are visible, the countdown won't start.<br />
        4. You don't need to have the hand up all the time. You can keep them down and hold one up only when you're ready to submit a rating.<br />
        5. It might take a couple seconds for the hand position to be recognised, please be patient.<br />
        The instructions will be available throughout the tasks by pressing the 'Instructions' button in the top right.
        <br /><br />
        You can now proceed with the tutorial.</>
      case 6: return <>In the following questions, you'll potentially be presented with the image of a bird and asked to identify what type of beak it has, based on the beak shape. To help you familiarize with the names of the various shapes, we've provided a primer for the different variations that you can visualise by hovering over each card. Please study this primer and familiarize yourself with the different shapes birds' beaks can take, and how they are named.</>
      case 7: return <>It is possible you will be asked to use web cam gestures when presented with the image of a bird and asked to identify what type of beak it has, based on the beak shape. To familiarize you with this process, we have created a simple tutorial for you. Note that these gestures are different than the ones used for the movie reviews. Click "Next" to launch the tutorial.</>
      case 8: return <>To select an answer, first hold up both your hands into a fist with your fingers facing the screen and keep the hands in the bottom half of the camera view.<br />
        Then choose one of the birds by raising the corresponding number of fingers. To confirm your answer, raise and hold one or both your hands, marked with a yellow square, to the top third of the camera view, marked with a red line (whilst keeping all the raised fingers still in view). This will start a countdown, after which your answer will be submitted.<br /> You can ONLY use your index to pinky finger, so the THUMB is NOT counted! Now use your fingers to choose and submit the bird number 5.</>
      case 9: return <>Well done! Now choose the bird number 8 and submit your answer.</>
      case 10: return <>Tutorial complete! Please note the following:<br />
        1. The countdown is there to confirm your answer and not to indicate a time limit.<br />
        2. Changing the number of fingers, closing your hands or moving your hands down before the countdown has ended will reset the countdown.<br />
        3. You can use one or both the left and right hand.<br />
        4. You don't need to have the hands in the camera view all the time. You can keep them out of view and hold them up only when you're ready to select and submit an answer.<br />
        5. It might take a couple seconds initially for the hand position to be recognised, please be patient.<br />
        The instructions will be available throughout the tasks by pressing the 'Instructions' button in the top right.
        <br /><br />
        You can now proceed to the task.</>
    }
  }

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ hand: true }), [])

  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>{getCurrentText()}</Typography>

      {step === 0 ? <><Rating name="Rating" size="large" /></> : null}

      { [2, 3, 4].includes(step) ? <>
        <Rating name="Rating" value={answer} size="large" readOnly />
        <HealthByte
          ref={movieHealthByteRef}
          classifier={movieClassifier.current}
          showConnectors={connectorOrLandmarkOptions}
          showLandmarks={connectorOrLandmarkOptions}
          className="w-1/2 mx-auto" />
        <Counter />
      </> : null }

      {step === 8 || step === 9 ? <>
        <HealthByte
        ref={birdHealthByteRef}
        classifier={birdClassifier.current}
        showConnectors={connectorOrLandmarkOptions}
        showLandmarks={connectorOrLandmarkOptions}
        className="w-1/2 mx-auto" />
      <Counter /></> : null}

      {[6, 8, 9].includes(step) ? <>
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
                      <Typography gutterBottom variant="subtitle2" component="div">{idx + 1}.{answer}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Tooltip>)
          }
        </Grid>
      </> : null}

      {[0, 1, 5, 6, 7].includes(step) ? <><Button variant='contained' onClick={() => proceed(step + 1)} sx={{ marginTop: '1em' }} color={'success'}>Next</Button></> : null}
      {step === 10 ? <><NextButton buttonText="Start Task" /></> : null}
    </CenterPage>
  )
}