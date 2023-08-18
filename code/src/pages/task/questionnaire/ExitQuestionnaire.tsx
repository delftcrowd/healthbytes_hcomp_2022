import { Button, Typography } from "@mui/material"
import { MyHolistic } from "components/healthbytes/MyHolistic"
import { CenterPage } from "components/molecules/CenterCard"
import { isExitQuestionnaireComplete, proceedTask } from "components/utils/task"
import { POST_TASK_SURVEY } from "constants/AppConstants"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "store/hooks"
import { setNotification } from "store/slices/notificationSlice"
import { RootState } from "store/store"

export const ExitQuestionnaire = () => {
  const pid = useAppSelector((state: RootState) => state.task.user)
  const condition = useAppSelector((state: RootState) => state.task.condition)
  const dispatch = useAppDispatch()

  const checkCompleted = () => {
    dispatch(isExitQuestionnaireComplete()).then(response => {
      if (response.data) {
        dispatch(proceedTask())
      } else {
        dispatch(setNotification({ message: 'Please complete the questionnaire before proceeding.', severity: 'error' }))
      }
    })
  }

  useEffect(() => {
    MyHolistic.clearInstance()
  }, [])

  return (
    <CenterPage>
      <Typography variant='h4' textAlign='center' marginBottom='1em'>Before we finish...</Typography>

      <Typography variant='subtitle1'>Please fill in the following questionnaire truthfully</Typography>

      <iframe
        allowFullScreen
        className='w-full h-[60vh]'
        src={`${POST_TASK_SURVEY}?PID=${pid}&condition=${condition}`}
      ></iframe>

      <Button variant='contained' onClick={checkCompleted} sx={{ marginTop: '1em' }} color={'success'}>Proceed to next step</Button>
    </CenterPage>
  )
}