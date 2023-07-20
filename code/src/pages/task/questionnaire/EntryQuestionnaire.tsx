import { Button, Typography } from "@mui/material"
import { CenterPage } from "components/molecules/CenterCard"
import { isEntryQuestionnaireComplete, proceedTask } from "components/utils/task"
import { useAppDispatch, useAppSelector } from "store/hooks"
import { setNotification } from "store/slices/notificationSlice"
import { RootState } from "store/store"

export const EntryQuestionnaire = () => {
  const pid = useAppSelector((state: RootState) => state.task.user)
  const dispatch = useAppDispatch()

  const checkCompleted = () => {
    dispatch(isEntryQuestionnaireComplete()).then(response => {
      if (response.data) {
        dispatch(proceedTask())
      } else {
        dispatch(setNotification({ message: 'Please complete the questionnaire before proceeding.', severity: 'error' }))
      }
    })
  }

  return (
    <CenterPage>
      <Typography variant='h4'>Before we begin...</Typography>

      <Typography variant='subtitle1'>Please fill in the following questionnaire truthfully</Typography>
      <iframe
        allowFullScreen
        className='w-full h-[60vh]'
        // src={`https://tudelft.fra1.qualtrics.com/jfe/form/SV_bKJDhU6yHphGOsS?PID=${pid}`}
        src={`https://tudelft.fra1.qualtrics.com/jfe/form/SV_2soJQSzaECKxYGi?PID=${pid}`}
      ></iframe>

      <Button variant='contained' onClick={checkCompleted} sx={{ marginTop: '1em' }} color={'success'}>Proceed to next step</Button>
    </CenterPage>
  )
}