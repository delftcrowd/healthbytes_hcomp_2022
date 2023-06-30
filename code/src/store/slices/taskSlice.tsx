import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const purposes = ['switching', 'hcomp'] as const
export type Purpose = typeof purposes[number]

export const taskTypes = ['bird', 'movie', 'person'] as const
export type TaskType = typeof taskTypes[number]

export const inputModalities = ['gesture', 'normal'] as const
export type InputModality = typeof inputModalities[number]
export interface Task {
  taskType?: TaskType
  inputModality?: InputModality
  purpose?: Purpose
  user: string
  questionNumber: number
  complete: boolean
  state: string
}

export interface TaskResponse {
  task: Task,
  currentQuestion: {}
}

const initialState: Task = {
  complete: false,
  questionNumber: 0,
  state: '',
  purpose: undefined,
  taskType: undefined,
  inputModality: undefined,
  user: ''
}

export const taskProgress = createSlice({
  name: 'taskProgress',
  initialState,
  reducers: {
    setTask: (state, action: PayloadAction<Task>) => {
      state.complete = action.payload.complete
      state.questionNumber = action.payload.questionNumber
      state.state = action.payload.state
      state.taskType = action.payload.taskType
      state.inputModality = action.payload.inputModality
      state.purpose = action.payload.purpose
      state.user = action.payload.user
      console.debug('setTask', state.purpose)
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTask } = taskProgress.actions

export default taskProgress.reducer