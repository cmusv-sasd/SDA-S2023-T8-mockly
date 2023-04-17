import FeedbackQuestions from '../models/FeedbackQuestions'
import ConcreteFeedbackQuestions from '../feedback/ConcreteFeedbackQuestions'
import LanguageDecorator from "../feedback/LanguageDecorator";
import TechnicalDecorator from "../feedback/TechnicalDecorator";
import ProfessionalismDecorator from '../feedback/ProfessionalismDecorator';
import QuestionsDecorator from '../feedback/QuestionsDecorator';
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
    const ifs = new FeedbackQuestions ({ userName: user,  decoratorsInterviewee: [],decoratorsInterviewer: [],questionsInterviewee:{B1: {
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
    const current_questions  = await FeedbackQuestions.findOne({ userName } ).exec()
    console.log("CQ: ",current_questions)
    const current = new ConcreteFeedbackQuestions({isInterviewer, questionsInterviewer: current_questions.questionsInterviewer, questionsInterviewee: current_questions.questionsInterviewee});
    //  console.log(current.toObject())
    const current_decorators = isInterviewer ? current_questions.decoratorsInterviewer : current_questions.decoratorsInterviewee
    console.log("cQ vs nQ", current_decorators, newQuestions)
    //  PROCESS TO ADD QUESTIONS
    let decorators = new QuestionsDecorator(current, isInterviewer)
    console.log("PREVIOUS QUESTIONS: ", current.toObject())
    const questionTypes = ["Language", "Technical", "Professionalism"]
    questionTypes.map((type)=>{
      //  include the preferences
      if((!current_decorators.includes(type) && newQuestions.includes(type))){
        switch(type){
          case "Language":
            decorators = new LanguageDecorator(decorators, isInterviewer )
            break;
          case "Technical":
            decorators  = new TechnicalDecorator(decorators, isInterviewer )
            break;
          case "Professionalism":
            decorators  = new ProfessionalismDecorator(decorators, isInterviewer )
            break;
        }
      }
    })
    decorators.addQuestions()
    console.log("decorators", decorators)
    console.log(current)
    console.log("CURRENT QUESTIONS: ", current.toObject())
    //  =====================================
    //  PROCESS TO REMOVE QUESTIONS
    decorators = new QuestionsDecorator(current, isInterviewer)
    questionTypes.map((type)=>{
      //  include the preferences
      if((current_decorators.includes(type) && !newQuestions.includes(type))){
        switch(type){
          case "Language":
            decorators = new LanguageDecorator(decorators, isInterviewer )
            break;
          case "Technical":
            decorators  = new TechnicalDecorator(decorators, isInterviewer )
            break;
          case "Professionalism":
            decorators  = new ProfessionalismDecorator(decorators, isInterviewer )
            break;
        }
      }
    })
    decorators.removeQuestions()
    console.log("decorators", decorators)
    console.log(current)
    console.log("CURRENT QUESTIONS: ", current.toObject())



    const currentObj = current.toObject()

    const fq= isInterviewer ? await FeedbackQuestions.findOneAndUpdate({userName}, {questionsInterviewer: currentObj.questionsInterviewer, decoratorsInterviewer: newQuestions}, ) : await FeedbackQuestions.findOneAndUpdate({userName}, {questionsInterviewee: currentObj.questionsInterviewee, decoratorsInterviewee: newQuestions})
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
