import { Dispatch } from '@reduxjs/toolkit'
import api from 'components/utils/api'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from 'constants/AppConstants'
import { createAuthProvider } from 'react-token-auth'
import { clearErrorMessage, setErrorMessage } from 'store/slices/errorMessageSlice'
import { sendingRequest } from 'store/slices/sendingRequestSlice'
import { Purpose, InputModality, TaskType, Condition } from 'store/slices/taskSlice'

export interface Session {
  access_token: string
  refresh_token?: string
}

export interface AuthenticationPayload {
  status: string,
  data: {
    user: {
      id: string
      username: string
    }
    payload: {
      type: string
      token: string
      refresh_token?: string
    }
  },
}

const getTokensAsSession = (payload: AuthenticationPayload): Session => {
  return {
    "access_token": payload.data.payload.token,
    "refresh_token": payload.data.payload.refresh_token
  }
}

export const [useAuth, authFetch, login, logout] = createAuthProvider<Session>({
  accessTokenKey: 'access_token',
  storage: localStorage,
  onUpdateToken: token =>
    api.post<AuthenticationPayload>('/auth/refresh', {
      method: 'POST',
      body: {
        refreshToken: token.refresh_token
      }
    }).then(r => getTokensAsSession(r.data))
      .finally(() => {
        localStorage.removeItem('REACT_TOKEN_AUTH_KEY')
      })
})

// --------------- AXIOS

export const authLogin = (pid: string, purpose: Purpose, taskType: TaskType, inputModality: InputModality, condition?: string ) => {
  return (dispatch: Dispatch) => {
    dispatch(sendingRequest(true))
    dispatch(clearErrorMessage())
    return api.post<AuthenticationPayload>(`/auth/login`, { prolificId: pid, purpose, taskType, inputModality, condition })
    .then(response => {
      setAccessToken(response.data.data.payload.token)
      if (response.data.data.payload.refresh_token) {
        setRefreshToken(response.data.data.payload.refresh_token)
      }
      login(getTokensAsSession(response.data))
    })
    .catch(error => {
      if (error.response) {
        dispatch(setErrorMessage(error.response.data?.message))
      }
    })
    .finally(() => {
      dispatch(sendingRequest(false))
    })
  }
}

export const authRegister = (pid: string) => {
  return (dispatch: Dispatch) => {
    dispatch(sendingRequest(true))
    dispatch(setErrorMessage(''))
    api.post<AuthenticationPayload>(`/auth/register`, { prolificId: pid })
      .then(response => {
        setAccessToken(response.data.data.payload.token)
        if (response.data.data.payload.refresh_token) {
          setRefreshToken(response.data.data.payload.refresh_token)
        }
        login(getTokensAsSession(response.data))
      })
      .catch(error => {
        if (error.response) {
          dispatch(setErrorMessage(error.response.data?.message))
        }
      })
      .finally(() => {
        dispatch(sendingRequest(false))
      })
  }
}

export const authLogout = () => {
  return (dispatch: Dispatch) => {
    dispatch(sendingRequest(true))
    dispatch(setErrorMessage(''))
    api.get('/auth/logout', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      },
    })
      .finally(() => {
        logout()
        removeAccessToken()
        removeRefreshToken()
        localStorage.clear()
        dispatch(sendingRequest(false))
      })
  }
}

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_NAME)
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_NAME)
}

export const setAccessToken = (access_token: string) => {
  localStorage.setItem(ACCESS_TOKEN_NAME, access_token)
}

export const setRefreshToken = (refresh_token: string) => {
  localStorage.setItem(REFRESH_TOKEN_NAME, refresh_token)
}

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_NAME)
}

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_NAME)
}
