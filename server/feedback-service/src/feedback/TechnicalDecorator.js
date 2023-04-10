import FeedbackDecorator from "./FeedbackDecorator";
//  import { isObjEmpty } from "../../util/misc";
const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
class TechnicalDecorator extends FeedbackDecorator{
  addQuestions(newQuestionsObj={}, isInterviewer = false){
    console.log("Outside technical loop", newQuestionsObj)
    //  call the previous decorators first
    super.addQuestions();
    //  Do what the Language Decorator should do
    if(isObjEmpty(newQuestionsObj) && isInterviewer){
      console.log("Inside technical loop")
      newQuestionsObj = {
        T1: 
          {
            question: "Were my technical questions too easy or too difficult",
            type: "1-5"
          },
        T2:
          {
            question: "Any additional feedback on my technical questions?",
            type: "text"
          }
      }
    }
    else if(isObjEmpty(newQuestionsObj) && !isInterviewer){
      console.log("Inside technical loop")
      newQuestionsObj = {
        T1: 
          {
            question: "Were my answers technical / in-depth enough?",
            type: "1-5"
          },
        T2:
          {
            question: "Any additional feedback on my technical questions?",
            type: "text"
          }
      }
    }
    //  add the new questions related to the Language
    super.addQuestions(newQuestionsObj)
  }
}

export default TechnicalDecorator