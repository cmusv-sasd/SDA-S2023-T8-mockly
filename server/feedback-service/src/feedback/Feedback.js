class Feedback {
  constructor(response) {
    //  this.reviewer = response.reviewer
    //  this.reviewee= response.reviewee
    this.userName = response.userName
    this.questions = {
      B1: {
        question: "How would you rate this interview experience?",
        type: "1-5"
      },
      B2: {
        question: "Any additional comments?",
        type: "text"
      }
    }
    //  this.answers = response.answers
  }

  toObject () {
    //  const obj = { reviewer : this.reviewer, reviewee: this.reviewee, questions: this.questions, answers: this.answers };
    const obj = { userName: this.userName, questions: this.questions };
    return obj;
  }

  //  save to MongoDB. not implemented yet
  save(){
    //  IMPLEMENT THIS
  }

  //  
  addQuestions(newQuestionsObj={},isInterviewer=false){
    this.questions = {...this.questions, ...newQuestionsObj}
  }

}

export default Feedback