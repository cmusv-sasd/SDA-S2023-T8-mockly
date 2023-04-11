import mongoose, { Schema } from 'mongoose'

const FeedbackQuestionsSchema = new Schema({
  // uuid of interviewee
  userName: {
    required: true,
    type: String
  },
  //  for now, have answers as an object
  questionsInterviewer: Object,
  questionsInterviewee: Object,
  decoratorsInterviewer: Array,
  decoratorsInterviewee: Array

})

export default mongoose.model('FeedbackQuestions', FeedbackQuestionsSchema)
