import { combineReducers, configureStore } from '@reduxjs/toolkit'
import user from './userSlice'
import interviews from './interviewsSlice'
import feedbackHistory from './feedbackHistorySlice'
import feedbackQuestions from './feedbackQuestionsSlice'
import feedback from './feedbackSlice'

const rootReducer = combineReducers({
  user,
  interviews,
  feedbackHistory,
  feedbackQuestions,
  feedback
})

export const store = configureStore({
  reducer: rootReducer
})
