class QuestionsDecorator {
  constructor(feedback, isInterviewer) {
    this.feedback = feedback;
    this.isInterviewer = isInterviewer
  }

  addQuestions(newQuestionsObj={}){
      this.feedback.addQuestions(newQuestionsObj);
  }
  removeQuestions(removeQuestionsArray=[]){
      this.feedback.removeQuestions(removeQuestionsArray);
  }
}

export default QuestionsDecorator