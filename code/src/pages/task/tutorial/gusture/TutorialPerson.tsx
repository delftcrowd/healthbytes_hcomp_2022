import { Button, Typography } from '@mui/material'
import Counter from 'components/atoms/Counter'
import { NextButton } from "components/atoms/NextButton"
import { ACTIONS_NAMES, GESTURE_NAMES, START_STOP } from 'components/gestures/pose/poses'
import { Classifier, GestureAction, GestureActivator } from 'components/healthbytes/Classifier'
import HealthByte, { ConnectorOrLandmarkOptions, HealthByteHandle } from 'components/healthbytes/HealthByte'
import { drawOutFace } from 'components/healthbytes/OverlayEffects'
import { CenterPage } from 'components/molecules/CenterCard'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch } from 'store/hooks'
import { resetCounter, startCounter } from 'store/slices/counterSlice'
import { setNotification } from 'store/slices/notificationSlice'


export const TutorialPerson = () => {

  const dispatch = useAppDispatch()
  const [step, setStep] = useState(0)
  const stage = useRef(0)
  const answerRef = useRef<number>(0)
  const [answer, setAnswerValue] = useState<number>(0)
  const healthByteRef = useRef<HealthByteHandle>(null)

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
      dispatch(setNotification({ message: "Please choose an option first!", severity: 'warning' }))
      return
    }

    switch (stage.current) {
      case 1: {
        if (answerRef.current === 1) {
          classifier.current.reset()
          dispatch(setNotification({ message: `Submitted answer Option 1`, severity: 'success' }))
          proceed(2)
        } else {
          dispatch(setNotification({ message: "That's the wrong option, try again!", severity: 'warning' }))
        }
        break
      }
      case 2: {
        if (answerRef.current === 2) {
          classifier.current.reset()
          dispatch(setNotification({ message: `Submitted answer Option 2`, severity: 'success' }))
          proceed(3)
        } else {
          dispatch(setNotification({ message: "That's the wrong option, try again!", severity: 'warning' }))
        }
        break
      }
    }

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
          callback: () => { submitAnswer() },
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

  useLayoutEffect(() => {
    healthByteRef.current?.addOverlays(drawOutFace)
  }, [healthByteRef.current])

  const getCurrentText = () => {
    switch (step) {
      case 0: return "In the following questions, you will be provided with the first and last name of a person. You will then need to find either the middle name or the profession of the individual shown. Use any search tool at your disposal to answer the questions; e.g. Google search (or any search engine) in a new tab or window. Once you have found the information, please select it from the list of available options. In total, you will be presented with 10 questions."
      case 1: return <>To choose the first option (on the left), please tilt your head LEFT until the Option 1 turns red. (Tilt meaning the motion of nearing the ear to the shoulder whilst keeping the head facing forward.)<br />Now dip (lower) your head until the 2 second countdown starts. Hold this position until the countdown ends, then your answer will be submitted. <br /></>
      case 2: return "Well done, now choose the second option (on the right), by tilting your head RIGHT first and then dipping your head for 2 seconds until the countdown stops."
      case 3: return <>Tutorial complete! Please note the following:<br />
        1. The countdown is there to confirm your answer and not to indicate a time limit.<br />
        2. Straightening the head before the countdown has ended will reset the countdown (This allows you to change your answer).<br />
        The instructions will be available throughout the tasks by pressing the 'Instructions' button in the top right.
        <br /><br />
        You can now proceed to the task.
      </>
    }
  }

  const renderSwitch = (step: number) => {
    switch (step) {
      case 0:
        return <Button variant='contained' onClick={() => proceed(1)} sx={{ marginTop: '1em' }} color={'success'}>Next</Button>
      case 1:
      case 2:
        return <>
          <div className='flex flex-row justify-around w-full'>
            <Typography variant='h6' color={getActiveStyle(0)}>Option 1</Typography>
            <Typography variant='h6' color={getActiveStyle(1)}>Option 2</Typography>
          </div>
          <HealthByte
            ref={healthByteRef}
            classifier={classifier.current}
            showConnectors={connectorOrLandmarkOptions}
            showLandmarks={connectorOrLandmarkOptions}
            className="w-1/2 mx-auto" />
          <Counter />
        </>
      case 3:
        return <NextButton buttonText="Next" />
      default:
        return null
    }
  }

  const connectorOrLandmarkOptions: ConnectorOrLandmarkOptions = useMemo(() => ({ body: true }), [])

  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Instructions</Typography>
      <Typography variant='subtitle1' textAlign='justify'>{getCurrentText()}</Typography>

      {renderSwitch(step)}
    </CenterPage>
  )
}