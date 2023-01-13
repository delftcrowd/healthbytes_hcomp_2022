import { Typography } from '@mui/material'
import { NextButton } from 'components/atoms/NextButton'
import RevokeConsentButton from 'components/atoms/RevokeConsent'
import { CenterPage } from 'components/molecules/CenterCard'
import { getTask, loadConsent } from 'components/utils/task'
import { Stages } from 'constants/AppConstants'
import ConsentRevokedScreen from 'pages/task/ConsentRevokedScreen'
import { EndPage } from 'pages/task/EndPage'
import { LandingPage } from 'pages/task/LandingPage'
import { EntryQuestionnaire } from 'pages/task/questionnaire/EntryQuestionnaire'
import { ExitQuestionnaire } from 'pages/task/questionnaire/ExitQuestionnaire'
import { TaskBird } from 'pages/task/task/gesture/TaskBird'
import { TaskMovie } from 'pages/task/task/gesture/TaskMovie'
import { TaskPerson } from 'pages/task/task/gesture/TaskPerson'
import { TaskBirdNormal } from 'pages/task/task/normal/TaskBirdNormal'
import { TaskMovieNormal } from 'pages/task/task/normal/TaskMovieNormal'
import { TaskPersonNormal } from 'pages/task/task/normal/TaskPersonNormal'
import { TutorialBird } from 'pages/task/tutorial/gusture/TutorialBird'
import { TutorialMovie } from 'pages/task/tutorial/gusture/TutorialMovie'
import { TutorialPerson } from 'pages/task/tutorial/gusture/TutorialPerson'
import { TutorialBirdNormal } from 'pages/task/tutorial/normal/TutorialBirdNormal'
import { TutorialMovieNormal } from 'pages/task/tutorial/normal/TutorialMovieNormal'
import { TutorialPersonNormal } from 'pages/task/tutorial/normal/TutorialPersonNormal'
import { useEffect } from 'react'
import { isChrome, isDesktop, isEdgeChromium } from 'react-device-detect'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { RootState } from 'store/store'

export default function TaskPage() {
  const taskState = useAppSelector((state: RootState) => state.task.state)
  const taskType = useAppSelector((state: RootState) => state.task.taskType)
  const inputModality = useAppSelector((state: RootState) => state.task.inputModality)
  const isConsentRevoked = useAppSelector((state: RootState) => state.consent.isRevoked)
  const dispatch = useAppDispatch()
  const stage: Stages = (taskState as unknown) as Stages

  function renderTutorial() {
    switch (taskType) {
      case 'bird':
        return <TutorialBird />
      case 'movie':
        return <TutorialMovie />
      case 'person':
        return <TutorialPerson />
    }
  }

  function renderTutorialNormal() {
    switch (taskType) {
      case 'bird':
        return <TutorialBirdNormal />
      case 'movie':
        return <TutorialMovieNormal />
      case 'person':
        return <TutorialPersonNormal />
    }
  }

  function renderPage() {
    if (isConsentRevoked) {
      return <ConsentRevokedScreen />
    }

    switch (inputModality) {
      case 'gesture':
        return renderGesturePage()
      case 'normal':
        return renderNormalPage()
      default:
        return 'Loading... Refresh if takes too long'
    }
  }

  function renderNormalPage() {
    switch (stage) {
      case Stages.landingPage:
        return <LandingPage />
      case Stages.entryQuestionnaire:
        return <EntryQuestionnaire />
      case Stages.tutorial:
        return renderTutorialNormal()
      case Stages.task:
        return <div>task</div> // this should not render
      case Stages.taskBird:
        return <TaskBirdNormal />
      case Stages.taskMovie:
        return <TaskMovieNormal />
      case Stages.taskMidname:
        return <TaskPersonNormal taskType='midname' />
      case Stages.taskProfession:
        return <TaskPersonNormal taskType='profession' />
      case Stages.taskEnd:
        return <CenterPage>All tasks completed. Please proceed to the next step. <NextButton buttonText="Next" /></CenterPage>
      case Stages.exitQuestionnaire:
        return <ExitQuestionnaire />
      case Stages.end:
        return <EndPage />
      case Stages.empty:
        return <CenterPage>Loading...</CenterPage>
      default:
        return <div>Invalid state</div>
    }
  }

  function renderGesturePage() {
    switch (stage) {
      case Stages.landingPage:
        return <LandingPage />
      case Stages.entryQuestionnaire:
        return <EntryQuestionnaire />
      case Stages.tutorial:
        return renderTutorial()
      case Stages.task:
        return <div>task</div> // this should not render
      case Stages.taskBird:
        return <TaskBird />
      case Stages.taskMovie:
        return <TaskMovie />
      case Stages.taskMidname:
        return <TaskPerson taskType='midname' />
      case Stages.taskProfession:
        return <TaskPerson taskType='profession' />
      case Stages.taskEnd:
        return <CenterPage>All tasks completed. Please proceed to the next step.<NextButton buttonText="Next" /></CenterPage>
      case Stages.exitQuestionnaire:
        return <ExitQuestionnaire />
      case Stages.end:
        return <EndPage />
      case Stages.empty:
        return <CenterPage>Loading...</CenterPage>
      default:
        return <div>Invalid state</div>
    }
  }

  useEffect(() => {
    dispatch(loadConsent())
    dispatch(getTask())
  }, [])

  return <>
    {(isChrome || isEdgeChromium) && isDesktop ?
      <>
        {renderPage()}
        {stage && stage !== 'landingPage' && stage !== 'end' && !isConsentRevoked ? <RevokeConsentButton /> : null}
      </> :
      <CenterPage>
        <Typography variant='h4'>Attention! Unsupported browser or device detected!</Typography>
        <Typography variant='body1'>To complete this research you need to use a Chromium browser (Google Chrome or Microsoft Edge) on a desktop/laptop device.<br />Please rejoin this research after changing to the appropriate device and browser. Otherwise, feel free to return the study on Prolific.</Typography>
      </CenterPage>}
  </>
}