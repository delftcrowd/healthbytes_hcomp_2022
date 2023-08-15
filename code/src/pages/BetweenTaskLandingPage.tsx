import { Button, Grid, Typography } from "@mui/material"
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from "components/molecules/CenterCard"
import { toggleInputModality, toggleUserTaskType, toggleOptedForOptional, proceedTask, getTask } from 'components/utils/task'
import { FormEventHandler, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from "store/hooks"
import { RootState } from "store/store"

const LineBreak = ({ height = '0.8em' }: { height?: string }) => {
    return <span style={{ display: 'block', marginBottom: height }}></span>
}

const styles = () => ({
    buttonCenter: {
        textAlign: 'center'
    }
});


export const BetweenTaskLandingPage = () => {
    // const taskType = useAppSelector((state: RootState) => state.task.taskType)
    // const inputModality = useAppSelector((state: RootState) => state.task.inputModality)
    // const purpose = useAppSelector((state: RootState) => state.task.purpose)
    const questionNumber = useAppSelector((state: RootState) => state.task.questionNumber)
    const optedForOptional = useAppSelector((state: RootState) => state.task.optedForOptional)
    const condition = useAppSelector((state: RootState) => state.task.condition)
    const currentState = useAppSelector((state: RootState) => state.task.state)
    const switchModalityAfterFirst = ['A1', 'A2', 'A4', 'A5', 'A9', 'A10', 'A12', 'A13', 'B1', 'B2', 'B4', 'B5', 'B9', 'B10', 'B12', 'B13']
    const switchModalityAfterSecond = ['A0', 'A1', 'A3', 'A4', 'A8', 'A9', 'A11', 'A12', 'B0', 'B1', 'B3', 'B4', 'B8', 'B9', 'B11', 'B12']
    const dispatch = useAppDispatch()
    const [checked, setChecked] = useState(false)

    const handleSubmit: FormEventHandler = event => {
        event.preventDefault()

        return checked
    }

    const handleSubmitOptIn = () => {
        dispatch(toggleOptedForOptional()).then(() => {
            dispatch(getTask())
        })
    }

    const proceedIfOptedIn = () => {
        if (optedForOptional && questionNumber <= 30) {
            dispatch(proceedTask())
        }
    }

    useEffect(() => {
        proceedIfOptedIn()
    }, [optedForOptional])

    const loadLandingMessage = () => {
        switch (currentState) {
            case "task.startMidLandingPage":
                if (!optedForOptional) {
                    // Check condition and swap input if needed
                    if (condition !== null && condition !== undefined && switchModalityAfterFirst.includes(condition)) {
                        dispatch(toggleInputModality())
                    }
                    
                    // Check condition to swap task type if needed
                    if (condition !== null && condition !== undefined && condition.slice(0,1) == "B") {
                        dispatch(toggleUserTaskType())
                    }
                    return <>
                        You have completed the first task!
                    </>
                } else {
                    return <>
                        You have completed the first optional task!
                    </>
                }
            case "task.midEndLandingPage":
                if (!optedForOptional) {
                    // Check condition and swap input if needed
                    if (condition !== null && condition !== undefined && switchModalityAfterSecond.includes(condition)) {
                        dispatch(toggleInputModality())
                    }

                    // Check condition to swap task type if needed
                    if (condition !== null && condition !== undefined && condition.slice(0,1) == "B") {
                        dispatch(toggleUserTaskType())
                    }
                    return <>
                        You have completed the second task!
                    </>
                } else {
                    return <>
                        You have completed the second optional task!
                    </>
                }
            case "task.optionalLandingPage":
                return <>
                    You have completed the required set of tasks!
                </>
            default:
                return <>
                    You have completed the last task!
                </>
        }
    }

    return (
        <CenterPage>
          {/* <Typography variant='h4' marginBottom='1em'>Welcome to HealthBytes!</Typography> */}
    
          <Typography variant='subtitle1' marginBottom='1em' fontWeight='medium' textTransform='uppercase'>{loadLandingMessage()}</Typography>
          { currentState !== "task.optionalLandingPage" ? <>
            <Typography variant='subtitle1' marginBottom='2em' textAlign='justify' lineHeight={1.6} >When you are ready, click the button below to proceed.</Typography>
            <NextButton buttonText="Proceed" type="submit" form="intermediateForm" />
          </> : <>
            <Typography variant='subtitle1' marginBottom='2em' textAlign='justify' lineHeight={1.6} >You may now continue to the exit survey, or optionally answer more questions. If you choose to do more tasks, you will simply repeat the process you just completed with new questions. <strong>Would you like to opt in for completing more tasks?</strong></Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                <Grid item xs={2}>
                    <NextButton buttonText="No" color="error" type="submit" form="intermediateForm" />
                </Grid>
                <Grid item xs={2}>
                    <Button variant='contained' sx={{ marginTop: '1em' }} onClick={handleSubmitOptIn} color="success">Yes, continue</Button>
                </Grid>
            </Grid>
          </>}
        </CenterPage>
      )
}