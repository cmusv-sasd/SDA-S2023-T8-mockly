import QuestionsDecorator from "./QuestionsDecorator";
const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}
    

class LanguageDecorator extends QuestionsDecorator{
  addQuestions(newQuestionsObj={}){
    //  call the previous decorators first
    super.addQuestions();
    //  Do what the Language Decorator should do
    if(isObjEmpty(newQuestionsObj) && this.isInterviewer){
      newQuestionsObj = {
        L1: 
          {
            question: "I'm a foreigner and my english skills aren't too good. Did you understand what I was saying?",
            type: "1-5"
          },
        L2:
          {
            question: "Any additional feedback on my speech?",
            type: "text"
          }
      }
    }
    else if(isObjEmpty(newQuestionsObj) && !this.isInterviewer){
      newQuestionsObj = {
        L1: 
          {
            question: "Was my speech clear?",
            type: "1-5"
          },
        L2:
          {
            question: "Any additional feedback on my speech?",
            type: "text"
          }
      }
    }
    //  add the new questions related to the Language
    super.addQuestions(newQuestionsObj)
  }
  //
  removeQuestions(removeQuestionsArray=[]){
    super.removeQuestions()
    if(removeQuestionsArray.length <= 0 && this.isInterviewer){
      removeQuestionsArray = ["L1", "L2"]
    }
    else if(removeQuestionsArray.length <=1 && !this.isInterviewer){
      removeQuestionsArray = ["L1", "L2"]
    }
    super.removeQuestions(removeQuestionsArray)
  }
}

export default LanguageDecorator