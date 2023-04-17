import request from "../utils/request"

const fetchInterviews = async (userId) => request(`matching/interviews?userId=${userId}`, {
  method: 'GET'
})

const findMatches = async (interviewData) => request('matching/matches', {
    method: 'POST',
    body: JSON.stringify(interviewData)
  })

const createInterview = async (interviewData) => request('matching/interviews', {
    method: 'POST',
    body: JSON.stringify(interviewData)
  })

const deleteInterview = async (interviewId) => request(`matching/interviews/${interviewId}`, {
  method: 'DELETE'
})

export { fetchInterviews, findMatches, createInterview, deleteInterview }
