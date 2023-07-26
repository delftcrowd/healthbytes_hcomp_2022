import { Typography } from "@mui/material"
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from "components/molecules/CenterCard"
import { toggleInputModality, toggleUserTaskType } from 'components/utils/task'
import { FormEventHandler, useState } from 'react'
import { useAppDispatch, useAppSelector } from "store/hooks"
import { RootState } from "store/store"


export const BetweenTaskLandingPage = () => {
    const taskType = useAppSelector((state: RootState) => state.task.taskType)
    const inputModality = useAppSelector((state: RootState) => state.task.inputModality)
    const purpose = useAppSelector((state: RootState) => state.task.purpose)
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

    const loadLandingMessage = () => {
        switch (currentState) {
            case "task.startMidLandingPage":
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
            case "task.midEndLandingPage":
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
          <Typography variant='subtitle1' marginBottom='2em' textAlign='justify' lineHeight={1.6} >When you are ready, click the button below to proceed.</Typography>
    
          <NextButton buttonText="Proceed" type="submit" form="intermediateForm" />
        </CenterPage>
      )
}