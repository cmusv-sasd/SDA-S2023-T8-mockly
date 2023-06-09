import QuestionsDecorator from "./QuestionsDecorator";
//  import { isObjEmpty } from "../../util/misc";
const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
    

class ProfessionalismDecorator extends QuestionsDecorator{
  addQuestions(newQuestionsObj={}){
    //  call the previous decorators first
    super.addQuestions();
    //  Do what the Professionalism Decorator should do
    if(isObjEmpty(newQuestionsObj) && this.isInterviewer){
      newQuestionsObj = {
        P1: 
          {
            question: "Was the interview too lax or too formal, 1 being too lax and 5 being too formal",
            type: "1-5"
          },
        P2:
          {
            question: "Any additional feedback on my professionalism?",
            type: "text", optional: true
          }
      }
    }
    else if(isObjEmpty(newQuestionsObj) && !this.isInterviewer){
      newQuestionsObj = {
        P1: 
          {
            question: "Was my demeanor professional?",
            type: "1-5"
          },
        P2:
          {
            question: "Any additional feedback on my professionalism?",
            type: "text", optional: true
          }
      }
    }
    //  add the new questions related to the Professionalism
    super.addQuestions(newQuestionsObj)
  }
  removeQuestions(removeQuestionsArray=[]){
    super.removeQuestions()
    if(removeQuestionsArray.length <= 0 && this.isInterviewer){
      removeQuestionsArray = ["P1", "P2", "P3"]
    }
    else if(removeQuestionsArray.length <= 0 && !this.isInterviewer){
      removeQuestionsArray = ["P1", "P2"]
    }
    super.removeQuestions(removeQuestionsArray)
  }
}

export default ProfessionalismDecorator