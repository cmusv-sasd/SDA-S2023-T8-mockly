import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  questions:{}
}

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback: (_, action) => ({ ...action.payload }),
    addQuestions: (state, action) => {
      const { questions } = action.payload
      //  need some logic to add questions
      return { ...state, ...questions }}
    ,
    removeQuestions: (state, action) => {
      //  need some logic to remove questions
      return { ...state, ...action.payload }}
    ,
  },
})

export const {
  setFeedback,
  addQuestions,
  removeQuestions
} = feedbackSlice.actions
export const feedbackSelector = (state) => state.feedback
export default feedbackSlice.reducer
