import { authLogin } from "components/utils/auth"
import { useQuery } from "components/utils/utilsTS"
import { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useAppDispatch } from "store/hooks"
import { inputModalities, InputModality, TaskType, taskTypes } from "store/slices/taskSlice"


function isValidTask(taskType: string): boolean {
  return !!taskTypes.find((type) => type == taskType)
}

function isValidModality(inputModality: string): boolean {
  return !!inputModalities.find((modality) => modality == inputModality)
}

const ProlificEntry = () => {
  const dispatch = useAppDispatch()
  let { taskType, modality } = useParams<{ taskType: TaskType, modality: InputModality }>()
  const isTaskValid = isValidTask(taskType)
  const isModalityValid = isValidModality(modality)
  const history = useHistory()
  const query = useQuery()

  useEffect(() => {
    // This clears previous jwt tokens, it is for testing purposes.
    localStorage.clear()
    const pid = query.get("PROLIFIC_PID")

    if (pid !== null && pid !== undefined && isTaskValid && isModalityValid) {
      // taskTypeRef.current = taskType

      dispatch(authLogin(pid, taskType, modality)).then(() => {
        history.replace('/task')
      })
    }
  }, [])

  return <>{isTaskValid && isModalityValid ? 'Loading...' : 'URL is malformed, contact researchers for support.'} </>
}

export default ProlificEntry