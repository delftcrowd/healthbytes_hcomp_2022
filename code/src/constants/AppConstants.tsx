export const WINDOW_SIZE = 3
export const FRAME_PARSE = 20
export const VISIBILITY_MIN = 0.1
export const VISIBILITY_THRESHOLD = 0.8
export const FRAMERATE = 30
export const ESTIMATION_THRESHOLD = 7.0 // 0 to 10
export const THUMB_THRESHOLD = -0.06 // approx 3~4 degrees
export const DECREASE_INTERVAL = 100 // ms
export const MOVIE_X_CLASSES = 5
export const DEFAULT_LANDMARK_OPTIONS = { lineWidth: 2, radius: 3, fillColor: '#fff6', color: '#0006', visibilityMin: VISIBILITY_MIN }
export const DEFAULT_CONNECTOR_OPTIONS = { lineWidth: 5, radius: 2, color: "#eee6", visibilityMin: VISIBILITY_MIN }

export interface IPrompt {
  question: string
  choice1: string
  choice2: string
}

export const enum PoseAction {
  START = "start",
  SUBMIT = "submit",
}

export const enum Stages {
  landingPage = 'landingPage',
  entryQuestionnaire = 'entryQuestionnaire',
  tutorial = 'tutorial',
  task = 'task',
  startMidLandingPage = 'task.startMidLandingPage',
  midEndLandingPage = 'task.midEndLandingPage',
  optionalLandingPage = 'task.optionalLandingPage',
  taskMidname = 'task.midname',
  taskProfession = 'task.profession',
  taskBird = 'task.bird',
  taskBirdStart = 'task.birdStart',
  taskBirdMid = 'task.birdMid',
  taskBirdEnd = 'task.birdEnd',
  taskMovie = 'task.movie',
  taskMovieStart = 'task.movieStart',
  taskMovieMid = 'task.movieMid',
  taskMovieEnd = 'task.movieEnd',
  taskEnd = 'task.taskEnd',
  exitQuestionnaire = 'exitQuestionnaire',
  end = 'end',
  empty = '',
}

export const BIRD_OPTIONS = [
  'all-purpose',
  'cone',
  'curved',
  'dagger',
  'hooked',
  'needle',
  'spatulate',
  'specialized'
]

export const COLOR_NAMES = [
  'Red',
  'Cyan',
  'Black',
  'Yellow',
  'Blue',
  'Gold',
  'Orange',
  'Grey',
  'Green',
  'Fire Engine Red',
  'Lime',
  'DarkBlue',
  'Purple',
  'Magenta',
  'LightBlue',
  'Wood',
  'Aquamarine',
  'Maroon',
]

// COMPLETION LINKS
export const COMPLETION_LINK = 'https://app.prolific.co/submissions/complete?cc={REDACTED}'

// SERVER
export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3333'

// AUTH
export const ACCESS_TOKEN_NAME = 'HEALTHBYTES_ACCESS'
export const REFRESH_TOKEN_NAME = 'HEALTHBYTES_REFRESH'