import request from '../utils/request'

// update personal identity (firstName, lastName, position, organization) for a particular user
// PUT /api/users/:userId/personal-identity
export const updatePersonalIdentityAPI = async (userId, payload) =>
  request(`users/${userId}/personal-identity`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

// fetch a user's profile by id (GET /api/users/:userId)
export const fetchUserAPI = async (userId) =>
  request(`users/${userId}?fields=password`, {
    method: 'GET',
  })

// update personal information (email, phone number, gender, ethnicity, pronouns) for a particular user
// PUT /api/users/:userId/personal-information
export const updatePersonalInformationAPI = async (userId, payload) =>
  request(`users/${userId}/personal-information`, {
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

// update interviewer details (type, fields, time) for a particular user
// PUT /api/users/:userId/interviewer-details
export const updateInterviewerDetailsAPI = async (userId, payload) =>
  request(`users/${userId}/interviewer-details`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

// add education details (schoolName, educationLevel, startDate, endDate, major, minor, gpa) for a particular user
// POST /api/users/:userId/education
export const addEducationDetailsAPI = async (userId, payload) =>
  request(`users/${userId}/education`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

// delete education details for a particular user
// DELETE /api/users/:userId/education
export const deleteEducationDetailsAPI = async (userId, payload) =>
  request(`users/${userId}/education`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  })

// update particular education details for a particular user
// PUT /api/users/:userId/education
export const updateEducationDetailsAPI = async (userId, payload) =>
  request(`users/${userId}/education`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
