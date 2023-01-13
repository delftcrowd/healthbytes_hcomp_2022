import { configureStore } from '@reduxjs/toolkit'
import consentSlice from 'store/slices/consentSlice'
import counterSlice from 'store/slices/counterSlice'
import errorMessageSlice from 'store/slices/errorMessageSlice'
import notificationSlice from 'store/slices/notificationSlice'
import questionSlice from 'store/slices/questionSlice'
import sendingRequestSlice from 'store/slices/sendingRequestSlice'
import taskSlice from 'store/slices/taskSlice'
import visualiserSlice from 'store/slices/visualiserSlice'



export const store = configureStore({
  reducer: {
    poseData: visualiserSlice,
    question: questionSlice,
    counter: counterSlice,
    currentlySending: sendingRequestSlice,
    errorMessage: errorMessageSlice,
    task: taskSlice,
    consent: consentSlice,
    notification: notificationSlice
  },
  devTools: true,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch