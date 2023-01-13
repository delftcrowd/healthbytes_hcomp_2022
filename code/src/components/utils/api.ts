import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { SERVER_URL } from 'constants/AppConstants'

import { AuthenticationPayload, getAccessToken, getRefreshToken, setAccessToken } from 'components/utils/auth'

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const api = axios.create({
  baseURL: SERVER_URL,
  responseType: 'json',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest: any) => api.post<AuthenticationPayload>('/auth/refresh', { refreshToken: getRefreshToken() })
  .then(response => {
    setAccessToken(response.data.data.payload.token)
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + getAccessToken()
    return Promise.resolve()
  })
// .catch(error => {
//   if (error.response) {
//     dispatch(setErrorMessage(error.response.statusText))
//   }
// })

createAuthRefreshInterceptor(api, refreshAuthLogic)

export default api