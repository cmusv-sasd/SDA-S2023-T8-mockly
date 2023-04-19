// eslint-disable-next-line no-unused-vars
import request from '../utils/request'
// eslint-disable-next-line no-unused-vars
const fetchFeedback = async (userName) => {
  return request(`feedback/feedback?revieweeName=${userName}`, {
    method: 'GET',
  })
}

const fetchFeedbackQuestions = async (userName) => {
  return request(`feedback/feedbackQuestions?userName=${userName}`, {
    method: 'GET',
  })
}

const createFeedback = async (feedbackData) => {
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
