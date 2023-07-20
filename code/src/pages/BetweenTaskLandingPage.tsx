import { Typography } from "@mui/material"
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from "components/molecules/CenterCard"
import { FormEventHandler, useState } from 'react'
import { useAppSelector } from "store/hooks"
import { RootState } from "store/store"


export const BetweenTaskLandingPage = () => {
    const taskType = useAppSelector((state: RootState) => state.task.taskType)
    const inputModality = useAppSelector((state: RootState) => state.task.inputModality)
    const purpose = useAppSelector((state: RootState) => state.task.purpose)
    const condition = useAppSelector((state: RootState) => state.task.condition)
    const currentState = useAppSelector((state: RootState) => state.task.state)
    const [checked, setChecked] = useState(false)

    const handleSubmit: FormEventHandler = event => {
        event.preventDefault()

        return checked
    }

    const loadLandingMessage = () => {
        switch (currentState) {
            case "task.startMidLandingPage":
                return <>
                    You have completed the first task!
                </>
            case "task.midEndLandingPage":
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