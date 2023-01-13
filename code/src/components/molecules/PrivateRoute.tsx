import { useAuth } from 'components/utils/auth'
import { ReactNode } from "react"
import { Redirect, Route, RouteProps } from "react-router-dom"

export interface LocationState {
  from: Location
}

const PrivateRoute = ({ children, ...rest }: { children: ReactNode } & RouteProps): JSX.Element => {
  const [logged] = useAuth()

  return (
    <Route {...rest} render={({ location }) => {
      return logged
        ? children
        : <Redirect to={{
          pathname: '/not_allowed',
          state: { from: location }
        }} />
    }}
    />
  )
}

export default PrivateRoute