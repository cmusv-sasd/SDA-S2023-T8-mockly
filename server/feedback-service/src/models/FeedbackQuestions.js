import mongoose, { Schema } from 'mongoose'

const FeedbackQuestionsSchema = new Schema({
  // uuid of interviewee
  reviewee: {
    required: true,
    type: String
  },
  //  for now, have answers as an object
  questionsInterviewer: Object,
  questionsInterviewee: Object 

})

export default mongoose.model('FeedbackQuestions', FeedbackQuestionsSchema)
