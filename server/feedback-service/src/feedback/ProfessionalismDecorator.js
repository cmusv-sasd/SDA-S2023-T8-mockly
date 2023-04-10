import FeedbackDecorator from "./FeedbackDecorator";
//  import { isObjEmpty } from "../../util/misc";
const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
    

class ProfessionalismDecorator extends FeedbackDecorator{
  addQuestions(newQuestionsObj={}, isInterviewer=false){
    //  call the previous decorators first
    console.log("Outside Professionalism loop", newQuestionsObj)
    super.addQuestions();
    //  Do what the Professionalism Decorator should do
    if(isObjEmpty(newQuestionsObj) && isInterviewer){
      console.log("Inside Professionalism loop")
      newQuestionsObj = {
        P1: 
          {
            question: "Was the interview too lax?",
            type: "1-5"
          },
        P2: 
          {
            question: "Was the interview too formal?",
            type: "1-5"
          },
        P3:
          {
            question: "Any additional feedback on my professionalism?",
            type: "text"
          }
      }
    }
    else if(isObjEmpty(newQuestionsObj) && !isInterviewer){
      newQuestionsObj = {
        P1: 
          {
            question: "Was my demeanor professional?",
            type: "1-5"
          },
        P2:
          {
            question: "Any additional feedback on my professionalism?",
            type: "text"
          }
      }
    }
    //  add the new questions related to the Professionalism
    super.addQuestions(newQuestionsObj)
  }
}

export default ProfessionalismDecorator