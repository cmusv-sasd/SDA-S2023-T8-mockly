class ConcreteFeedbackQuestions {
  constructor(response) {
    //  this.reviewer = response.reviewer
    //  this.reviewee= response.reviewee
    this.userName = response.userName
    this.isInterviewer = response.isInterviewer
    this.questionsInterviewer = response.questionsInterviewer
    this.questionsInterviewee = response.questionsInterviewee
  }

  toObject () {
    //  const obj = { reviewer : this.reviewer, reviewee: this.reviewee, questions: this.questions, answers: this.answers };
    const obj = { userName: this.userName, questionsInterviewer: this.questionsInterviewer, questionsInterviewee: this.questionsInterviewee };
    return obj;
  }

  //  
  addQuestions(newQuestionsObj={}){
    if(this.isInterviewer){
      this.questionsInterviewer = {...this.questionsInterviewer, ...newQuestionsObj}
    }
    else{
      this.questionsInterviewee = {...this.questionsInterviewee, ...newQuestionsObj}
    }
    //  this.questions = {...this.questions, ...newQuestionsObj}
  }
  //
  removeQuestions(questionsArray,isInterviewer=false){
    console.log("")
  }


}

export default ConcreteFeedbackQuestions