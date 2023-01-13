import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface QuestionState {
  question: string
  answers: string[]
}

const initialState: QuestionState = {
  question: '',
  answers: []
}

export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<{
      question: string,
      answers: string[]
    }>) => {
      state.question = action.payload.question
      state.answers = action.payload.answers
    },
  },
})

// Action creators are generated for each case reducer function
export const { setQuestion } = questionSlice.actions

export default questionSlice.reducer