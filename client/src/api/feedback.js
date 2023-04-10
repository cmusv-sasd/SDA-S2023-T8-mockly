// eslint-disable-next-line no-unused-vars
import request from '../utils/request'
// eslint-disable-next-line no-unused-vars
const fetchFeedback = async (userName) => {
  const dummyData = [
    {
      time: '2019-01-25',
      reviewer: 'userA',
      questions: {
        B1: {
          question: 'How would you rate this interview experience?',
          type: '1-5',
        },
        B2: { question: 'Any additional comments?', type: 'text' },
        L1: {
          question:
            "I'm a foreigner and my english skills aren't too good. Did you understand what I was saying?",
          type: '1-5',
        },
        L2: {
          question: 'Any additional feedback on my speech?',
          type: 'text',
        },
        T1: {
          question: 'Were my technical questions too easy or too difficult',
          type: '1-5',
        },
        T2: {
          question: 'Any additional feedback on my technical questions?',
          type: 'text',
        },
        P1: { question: 'Was the interview too lax?', type: '1-5' },
        P2: { question: 'Was the interview too formal?', type: '1-5' },
        P3: {
          question: 'Any additional feedback on my professionalism?',
          type: 'text',
        },
      },
      answers: {
        B1: '5',
        B2: 'N/A',
        L1: '3',
        L2: 'N/A',
        T1: '2',
        P1: '1',
        P2: '2',
        P3: 'N/A',
      },
    },
    {
      time: '2019-01-26',
      reviewer: 'userB',
      questions: {
        B1: {
          question: 'How would you rate this interview experience?',
          type: '1-5',
        },
        B2: { question: 'Any additional comments?', type: 'text' },
        P1: { question: 'Was the interview too lax?', type: '1-5' },
        P2: { question: 'Was the interview too formal?', type: '1-5' },
        P3: {
          question: 'Any additional feedback on my professionalism?',
          type: 'text',
        },
      },
      answers: {
        B1: '5',
        B2: 'N/A',
        P1: '1',
        P2: '1',
        P3: 'GREAT intervieweer',
      },
    },
    {
      time: '2019-01-27',
      reviewer: 'userC',
      questions: {
        B1: {
          question: 'How would you rate this interview experience?',
          type: '1-5',
        },
        B2: { question: 'Any additional comments?', type: 'text' },
      },
      answers: {},
    },
  ]
  console.log(dummyData)
  console.log('this is the name: ', userName)
  return request(`feedback/feedback?revieweeName=${userName}`, {
    method: 'GET',
  })
}

const fetchFeedbackQuestions = async (userName) => {
  console.log('this is the name for FQ: ', userName)
  return request(`feedback/feedbackQuestions?userName=${userName}`, {
    method: 'GET',
  })
}
/*
request(`/feedback?userId=${userId}`, {
  method: 'GET'
})
*/
/*
const findMatches = async (interviewData) => request('matching/matches', {
    method: 'POST',
    body: JSON.stringify(interviewData)
  })
*/

const createFeedback = async (feedbackData) => {
  console.log('in CF', feedbackData)
  console.log(JSON.stringify(feedbackData))
  request('feedback/addFeedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  })
}

const updateFeedbackQuestions = async (userId, payload) =>
  request(`feedback/feedbackQuestions/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

export { fetchFeedback, createFeedback, fetchFeedbackQuestions, updateFeedbackQuestions }
