import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const taskTypes = ['bird', 'movie', 'person'] as const
export type TaskType = typeof taskTypes[number]

export const inputModalities = ['gesture', 'normal'] as const
export type InputModality = typeof inputModalities[number]
export interface Task {
  taskType?: TaskType
  inputModality?: InputModality
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
      state.user = action.payload.user
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTask } = taskProgress.actions

export default taskProgress.reducer