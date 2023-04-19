import Feedback from "../models/Feedback"
import fetch from 'node-fetch'

class FeedbackController {
  /*
  * Create a feedback result created by reviewer for the reviewee
  */
  async create(reviewer="default Reviewer", reviewee="default Reviewee", time, isInterviewer, questions, answers) {
    //  prob should check that the feedback is written then return something
    //  this isInterviewer  checks if the recipient is the Interviewer
    //    so we want the opposite. If isInterviewer is true, the Interviewee is sending feedback
    const type = isInterviewer ? "Interviewee to Interviewer" : "Interviewer to Interviewee"
    let decorators = []
    console.log(answers)
    Object.keys(answers).map((key)=>{
      switch(key){
        case "B1":
          decorators.push("base")
          break;
        case "P1":
          decorators.push("professionalism")
          break;
        case "T1":
          decorators.push("technical")
      }
    })
    const ifs = new Feedback ({ reviewer, reviewee, time, type, decorators, questions, answers })
    await ifs.save()
    return ifs
  }

  async getAll(){

    const feedback = await Feedback.find({}).exec()
    return feedback 
  }

  async getFeedback(revieweeName){

    //  const [firstName, lastName] = revieweeName.split(" ")
    const feedback  = await Feedback.find({ reviewee: revieweeName } ).exec()

    return feedback 
  }

}

export default new FeedbackController
