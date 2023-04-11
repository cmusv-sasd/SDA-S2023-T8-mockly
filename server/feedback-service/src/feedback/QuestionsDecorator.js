class QuestionsDecorator {
  constructor(feedback, isInterviewer) {
    this.feedback = feedback;
    this.isInterviewer = isInterviewer
  }

  addQuestions(newQuestionsObj={}){
      this.feedback.addQuestions(newQuestionsObj);
  }
}

export default QuestionsDecorator