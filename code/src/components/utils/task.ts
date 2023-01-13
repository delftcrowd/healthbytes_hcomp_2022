import { Dispatch } from "@reduxjs/toolkit"
import { LandmarkAggregate } from 'components/gestures/Gesture'
import api from "components/utils/api"
import { getAccessToken } from "components/utils/auth"
import { PoseAction } from "constants/AppConstants"
import { setIsRevoked } from "store/slices/consentSlice"
import { setErrorMessage } from "store/slices/errorMessageSlice"
import { setNotification } from "store/slices/notificationSlice"
import { QuestionState, setQuestion } from "store/slices/questionSlice"
import { setTask, Task, TaskResponse, TaskType } from "store/slices/taskSlice"


export const startTask = (tasktype: TaskType) => {
  return (dispatch: Dispatch) => {
    api.get<Task>(`/task/start/${tasktype}`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })
      .then(data => {
        if (data.data) {
          console.debug(data.data)
          dispatch(setTask(data.data))
        }
      })
      .catch(error => {
        if (error.response) {
          dispatch(setErrorMessage(error.response.data?.message))
        }
      })
  }
}

export const getTask = () => {
  return (dispatch: Dispatch) => {
    api.get<Task>(`/task/progress`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    }).then(data => {
      if (data.data) {
        console.debug(data.data)
        dispatch(setTask(data.data))
      }
    })
      .catch(error => {
        if (error.response) {
          dispatch(setErrorMessage(error.response.data?.message))
        }
      })
  }
}

export const loadQuestion = () => {
  return (dispatch: Dispatch) => {
    return api.get<QuestionState>(`/task/question`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })
      .then(data => {
        if (data.data) {
          console.debug(data.data)
          dispatch(setQuestion(data.data))
        }
      })
      .catch(error => {
        if (error.response) {
          dispatch(setErrorMessage(error.response.data?.message))
        }
      })
  }
}

export const proceedTask = () => {
  return (dispatch: Dispatch) => {
    return api.post<TaskResponse>(`/task/next`, {}, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      dispatch(setTask(response.data.task))
    })
  }
}

export const sendAnswer = (answer: string | number) => {
  return (dispatch: Dispatch) => {
    api.post<TaskResponse>(`/task/answer`, { answer: answer }, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      dispatch(setNotification({
        message: `Submitted answer ${answer}`,
        severity: "success"
      }))
      dispatch(setTask(response.data.task))
    })
  }
}

export const sendPose = (poseAction: PoseAction, poseData?: LandmarkAggregate) => {
  return (dispatch: Dispatch) => {
    api.post<TaskResponse>(`/task/pose`, { actionType: poseAction, landmarks: poseData }, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
}

export const revokeConsent = () => {
  return (dispatch: Dispatch) => {
    api.post<boolean>(`/user/revokeConsent`, {}, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      dispatch(setIsRevoked(response.data))
    })
  }
}

export const loadConsent = () => {
  return (dispatch: Dispatch) => {
    api.get<boolean>('/user/isConsentRevoked', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      dispatch(setIsRevoked(response.data))
    })
  }
}

export const isEntryQuestionnaireComplete = () => {
  return (dispatch: Dispatch) => {
    return api.get<boolean>('/user/isEntryQuestionnaireComplete', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
}

export const isExitQuestionnaireComplete = () => {
  return (dispatch: Dispatch) => {
    return api.get<boolean>('/user/isExitQuestionnaireComplete', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
}