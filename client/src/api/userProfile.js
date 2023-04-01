import request from '../utils/request'

export const updatePersonalIdentityAPI = async (payload) =>
  request('users/personal-identity', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

// fetch a user's profile by id (GET /api/users/:userId)
export const fetchUserAPI = async (userId) =>
  request(`users/${userId}?fields=password`, {
    method: 'GET',
  })

export const updatePersonalInformationAPI = async (payload) =>
  request('users/personal-information', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

// add a new skill for a particular user (POST /api/users/:userId/skills)
export const addSkillAPI = async (userId, payload) =>
  request(`users/${userId}/skills`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

// delete a skill of a particular user (DELETE /api/users/:userId/skills)
export const deleteSkillAPI = async (userId, payload) =>
  request(`users/${userId}/skills`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  })

// add a new course for a particular user (POST /api/users/:userId/courses)
export const addCourseAPI = async (userId, payload) =>
  request(`users/${userId}/courses`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

// delete a course for a particular user (DELETE /api/users/:userId/courses)
export const deleteCourseAPI = async (userId, payload) =>
  request(`users/${userId}/courses`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  })

// update summary of a particular user (UPDATE /api/users/:userId/summary)
export const updateSummaryAPI = async (userId, payload) =>
  request(`users/${userId}/summary`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const updateInterviewerDetailsAPI = async (userId, payload) =>
  request(`users/${userId}/interviewer-details`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
