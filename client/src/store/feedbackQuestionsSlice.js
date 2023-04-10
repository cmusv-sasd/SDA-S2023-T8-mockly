import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questionsInterviewer: {},
  questionsInterviewee: {},
}

const feedbackQuestionsSlice = createSlice({
  name: 'feedbackQuestions',
  initialState,
  reducers: {
    setFeedbackQuestions: (_, action) => ({ ...action.payload }),
    addQuestions: (state, action) => {
      const { questions, isInterviewer } = action.payload
      //  need some logic to add questions
      const new_state = isInterviewer ? { ...state, questionsInterviewer: questions } : { ...state, questionsInterviewee: questions }
      return new_state
    },
    removeQuestions: (state, action) => {
      //  need some logic to remove questions
      return { ...state, ...action.payload }
    },
  },
})

export const { setFeedbackQuestions, addQuestions, removeQuestions } =
  feedbackQuestionsSlice.actions
export const feedbackQuestionsSelector = (state) => state.feedbackQuestions
export default feedbackQuestionsSlice.reducer
