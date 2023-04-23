import QuestionsDecorator from "./QuestionsDecorator";
//  import { isObjEmpty } from "../../util/misc";
const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
class TechnicalDecorator extends QuestionsDecorator{
  addQuestions(newQuestionsObj={}){
    //  call the previous decorators first
    super.addQuestions();
    //  Do what the Language Decorator should do
    if(isObjEmpty(newQuestionsObj) && this.isInterviewer){
      newQuestionsObj = {
        T1: 
          {
            question: "Were my technical questions too easy or too difficult",
            type: "1-5"
          },
          T2: 
          {
            question: "Were there any technical questions / fields you would have liked to be asked about but I did not ask them?",
            type: "1-5"
          },
        T3:
          {
            question: "Any additional feedback on my technical questions?",
            type: "text", optional: true
          }
      }
    }
    else if(isObjEmpty(newQuestionsObj) && !this.isInterviewer){
      newQuestionsObj = {
        T1: 
          {
            question: "Were my answers technical / in-depth enough?",
            type: "1-5"
          },
        T2:{
          question:"Would you have liked more in-depth answers in certain areas? If so, please clearly state what areas you think I could work on?",
          type: "text"
        },
        T3:
          {
            question: "Any additional feedback on my technical questions?",
            type: "text", optional: true
          }
      }
    }
    //  add the new questions related to the Language
    super.addQuestions(newQuestionsObj)
  }
  removeQuestions(removeQuestionsArray=[]){
    super.removeQuestions()
    if(removeQuestionsArray.length <= 0 && this.isInterviewer){
      removeQuestionsArray = ["T1", "T2"]
    }
    else if(removeQuestionsArray.length <= 0 && !this.isInterviewer){
      removeQuestionsArray = ["T1", "T2"]
    }
    super.removeQuestions(removeQuestionsArray)
  }
}

export default TechnicalDecorator