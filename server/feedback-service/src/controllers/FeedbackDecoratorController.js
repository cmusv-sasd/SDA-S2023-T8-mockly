import FeedbackQuestions from '../models/FeedbackQuestions'
import fetch from 'node-fetch'

class FeedbackDecoratorController {
  /*
  * Create a feedback result created by reviewer for the user
  */
  async create(user="default user",  questions={}) {
    //  prob should check that the feedback is written then return something
    const ifs = new FeedbackQuestions ({ userName: user,  questionsInterviewee:{B1: {
        question: "How would you rate this interview experience?",
        type: "1-5"
      },
      B2: {
        question: "Any additional comments?",
        type: "text"
      }}, questionsInterviewer:{B1: {
        question: "How would you rate this interview experience?",
        type: "1-5"
      },
      B2: {
        question: "Any additional comments?",
        type: "text"
      }} })
    await ifs.save()
    return ifs
  }

  async getAll(){

    const feedback = await FeedbackQuestions.find({}).exec()
    return feedback 
  }

  async getQuestions(userName){
    //  const [firstName, lastName] = userName.split(" ")
    const questions  = await FeedbackQuestions.findOne({ userName } ).exec()
    return questions
  }

  /*
  * Modify questions by name
  */ 
  async modifyFeedbackQuestions(userName, newQuestions, isInterviewer) {
    const fq= isInterviewer ? await FeedbackQuestions.findByIdAndUpdate(userName, {questionsInterviewer: newQuestions}) : await Match.findByIdAndUpdate(userName, {questionsInterviewee: newQuestions})
    if (fq) {
      return fq
    } else {
      throw new Error('Failed to update feedback questions.')
    }
  }

}

export default new FeedbackDecoratorController
