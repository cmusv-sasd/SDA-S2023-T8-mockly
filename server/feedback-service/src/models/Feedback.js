import mongoose, { Schema } from 'mongoose'

const FeedbackSchema = new Schema({
  // uuid of interviewer
  reviewer: {
    required: true,
    type: String
  },
  // uuid of interviewee
  reviewee: {
    required: true,
    type: String
  },
  //  for now, have answers as an object
  answers:  Object,
  questions:  Object,
  time: String,
  type: String,
  decorators: Array
})

export default mongoose.model('Feedback', FeedbackSchema)
