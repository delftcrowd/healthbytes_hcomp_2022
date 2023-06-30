import PrivateRoute from 'components/molecules/PrivateRoute'
import ProlificEntry from 'pages/prolific/ProlificEntry'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NotAllowedPage from './notAllowed'
import TaskPage from './task'

export const MyRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/prolific/:purpose/:taskType/:modality"><ProlificEntry /></Route>
        <PrivateRoute exact path='/task'> <TaskPage /></PrivateRoute>
      </Switch>
    </BrowserRouter >
  )
}