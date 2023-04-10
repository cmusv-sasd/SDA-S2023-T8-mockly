class FeedbackDecorator {
  constructor(feedback) {
    this.feedback = feedback;
  }

  addQuestions(newQuestionsObj={},isInterviewer=false){
      this.feedback.addQuestions(newQuestionsObj);
  }
}

export default FeedbackDecorator