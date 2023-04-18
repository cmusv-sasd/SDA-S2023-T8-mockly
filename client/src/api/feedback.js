// eslint-disable-next-line no-unused-vars
import request from '../utils/request'
// eslint-disable-next-line no-unused-vars
const fetchFeedback = async (userName) => {
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


const createFeedbackQuestions = async (userName) =>
  request(`feedbackQuestions/addBaseFeedbackQuestions`, {
    method: 'POST',
    body: JSON.stringify({userName}),
  })

export { fetchFeedback, createFeedback, fetchFeedbackQuestions, updateFeedbackQuestions, createFeedbackQuestions }
