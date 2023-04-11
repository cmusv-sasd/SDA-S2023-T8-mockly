import FeedbackQuestions from '../models/FeedbackQuestions'
import fetch from 'node-fetch'

class FeedbackDecoratorController {
  /*
  * Create a feedback result created by reviewer for the user
  */
  async create(user="default user",  questions={}) {
    //  prob should check that the feedback is written then return something
    if(!user || user.length === 0 || user === " "){
      return {}
    }
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
    console.log("In mFQ", userName, newQuestions, isInterviewer)
    const fq= isInterviewer ? await FeedbackQuestions.findOneAndUpdate({userName}, {questionsInterviewer: newQuestions}) : await FeedbackQuestions.findOneAndUpdate({userName}, {questionsInterviewee: newQuestions})
    if (fq) {
      console.log("mFQ result: ", fq)
      return fq
    } else {
      console.log("failed mFQ")
      throw new Error('Failed to update feedback questions.')
    }
  }

}

export default new FeedbackDecoratorController
