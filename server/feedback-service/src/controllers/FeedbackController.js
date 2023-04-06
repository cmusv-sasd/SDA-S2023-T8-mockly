import InterviewFeedback from "../models/InterviewFeedback"
import Feedback from "../models/Feedback"
import fetch from 'node-fetch'

class FeedbackController {
  /*
  * Create a feedback result created by reviewer for the reviewee
  */
  async create(reviewer="default Reviewer", reviewee="default Reviewee", time, questions, answers) {
    //  prob should check that the feedback is written then return something
    const ifs = new Feedback ({ reviewer, reviewee, time, questions, answers })
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
