import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const purposes = ['switching', 'hcomp'] as const
export type Purpose = typeof purposes[number]

export const taskTypes = ['bird', 'movie', 'person'] as const
export type TaskType = typeof taskTypes[number]

export const inputModalities = ['gesture', 'normal'] as const
export type InputModality = typeof inputModalities[number]

export const conditions = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15',
'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15',
] as const
export type Condition = typeof conditions[number]

export interface Task {
  taskType?: TaskType
  inputModality?: InputModality
  purpose?: Purpose
  condition?: Condition
  user: string
  questionNumber: number
  complete: boolean
  state: string
  optedForOptional: boolean
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
  user: '',
  optedForOptional: false
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
      state.condition = action.payload.condition,
      state.user = action.payload.user
      state.optedForOptional = action.payload.optedForOptional
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTask } = taskProgress.actions

export default taskProgress.reducer