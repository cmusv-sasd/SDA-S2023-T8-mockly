import { Router } from 'express'
import fetch from 'node-fetch'
import { headers } from '../utils/constants'
import { verifyUserIdParam } from '../middlewares/verifyUserIdParam'

const router = Router()
const BASE_URL = 'http://mockly-profile-service:3005/users'

// GET /users/:userId
// Get user profile by ID
router.get('/:userId', async (request, response) => {
  try {
    const filterFieldString = request.query.fields
    const userId = request.params.userId
    let requestURL = `${BASE_URL}/${userId}`
    if (filterFieldString && filterFieldString.length) {
      requestURL += '?fields=' + filterFieldString
    }
    const resp = await fetch(requestURL, {
      headers,
    })
    const user = await resp.json()
    response.json(user)
  } catch (e) {
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

// PUT /users/:userId/personal-identity
// Update personal identity fields for a user
router.put(
  '/:userId/personal-identity',
  verifyUserIdParam,
  async (request, response) => {
    const userId = request.params.userId
    const options = {
      method: 'PUT',
      body: JSON.stringify(request.body),
      headers,
    }
    try {
      const resp = await fetch(
        `${BASE_URL}/${userId}/personal-identity`,
        options
      )
      const updatedUser = await resp.json()
      response.status(resp.status).json(updatedUser)
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// PUT /users/:userId/personal-information
// Update personal information fields for a user
router.put(
  '/:userId/personal-information',
  verifyUserIdParam,
  async (request, response) => {
    const userId = request.params.userId
    const options = {
      method: 'PUT',
      body: JSON.stringify(request.body),
      headers,
    }
    try {
      const resp = await fetch(
        `${BASE_URL}/${userId}/personal-information`,
        options
      )
      const updatedUser = await resp.json()
      response.json(updatedUser)
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// POST /users/:userId/education
// Create a new education entry for a particular user
router.post(
  '/:userId/education',
  verifyUserIdParam,
  async (request, response) => {
    try {
      const userId = request.params.userId
      const options = {
        method: 'POST',
        body: JSON.stringify(request.body),
        headers,
      }

      const resp = await fetch(`${BASE_URL}/${userId}/education`, options)
      const newEducation = await resp.json()
      response.json(newEducation)
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// PUT /users/:userId/education
// Update an existing education entry for a particular user
router.put(
  '/:userId/education',
  verifyUserIdParam,
  async (request, response) => {
    try {
      const userId = request.params.userId
      const options = {
        method: 'PUT',
        body: JSON.stringify(request.body),
        headers,
      }
      const resp = await fetch(`${BASE_URL}/${userId}/education`, options)
      const updatedEducation = await resp.json()
      response.json(updatedEducation)
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// DELETE /users/:userId/education
// Delete an existing education entry for a particular user
router.delete(
  '/:userId/education',
  verifyUserIdParam,
  async (request, response) => {
    try {
      const userId = request.params.userId
      const options = {
        method: 'DELETE',
        body: JSON.stringify(request.body),
        headers,
      }
      const resp = await fetch(`${BASE_URL}/${userId}/education`, options)
      const respJSON = await resp.json()
      response.json(respJSON)
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// POST /users/:userId/skills
// Create a new skill for a particular user
router.post('/:userId/skills', verifyUserIdParam, async (request, response) => {
  const userId = request.params.userId
  const options = {
    method: 'POST',
    body: JSON.stringify(request.body),
    headers,
  }
  try {
    const resp = await fetch(`${BASE_URL}/${userId}/skills`, options)
    const skill = await resp.json()
    response.json(skill)
  } catch (e) {
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

// DELETE /users/:userId/skills
// Delete a skill for a particular user
router.delete(
  '/:userId/skills',
  verifyUserIdParam,
  async (request, response) => {
    const userId = request.params.userId
    const options = {
      method: 'DELETE',
      body: JSON.stringify(request.body),
      headers,
    }
    try {
      const resp = await fetch(`${BASE_URL}/${userId}/skills`, options)
      const message = await resp.json()
      response.status(resp.status).json({ message: message })
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// POST /users/:userId/courses
// Create a new course entry for a particular user
router.post(
  '/:userId/courses',
  verifyUserIdParam,
  async (request, response) => {
    const userId = request.params.userId
    const options = {
      method: 'POST',
      body: JSON.stringify(request.body),
      headers,
    }
    try {
      const resp = await fetch(`${BASE_URL}/${userId}/courses`, options)
      const course = await resp.json()
      response.json(course)
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// DELETE /users/:userId/courses
// Delete an existing course entry for a particular user
router.delete(
  '/:userId/courses',
  verifyUserIdParam,
  async (request, response) => {
    const userId = request.params.userId
    const options = {
      method: 'DELETE',
      body: JSON.stringify(request.body),
      headers,
    }
    try {
      const resp = await fetch(`${BASE_URL}/${userId}/courses`, options)
      const message = await resp.json()
      response.status(resp.status).json({ message: message })
    } catch (e) {
      response.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

// POST /users/projects
// Create a new project entry for a user
router.post('/projects', async (req, res) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' },
  }
  try {
    const resp = await fetch(`${BASE_URL}/projects`, options)
    const project = await resp.json()
    res.json(project)
  } catch (e) {
    res.status(500)
  }
})

// PUT /users/projects
// Update an existing project entry for a user
router.put('/projects', async (req, res) => {
  const options = {
    method: 'PUT',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' },
  }
  try {
    const resp = await fetch(`${BASE_URL}/projects`, options)
    const project = await resp.json()
    res.json(project)
  } catch (e) {
    res.status(500)
  }
})

// DELETE /users/projects
// Delete an existing project entry for a user
router.delete('/projects', async (request, response) => {
  const { body } = request
  const options = { method: 'DELETE', body: JSON.stringify(body), headers }
  try {
    const resp = await fetch(`${BASE_URL}/projects`, options)
    const project = await resp.json()
    response.json(project)
  } catch (e) {
    response.status(500)
  }
})

// POST /users/experiences
// Create a new experience entry for a user
router.post('/experiences', async (request, response) => {
  const { body } = request
  const options = { method: 'POST', body: JSON.stringify(body), headers }
  try {
    const resp = await fetch(`${BASE_URL}/experiences`, options)
    const experience = await resp.json()
    response.json(experience)
  } catch (e) {
    response.status(500)
  }
})

// PUT /users/experiences
// Update an existing experience entry for a user
router.put('/experiences', async (request, response) => {
  const { body } = request
  const options = { method: 'PUT', body: JSON.stringify(body), headers }
  try {
    const resp = await fetch(`${BASE_URL}/experiences`, options)
    const experience = await resp.json()
    response.json(experience)
  } catch (e) {
    response.status(500)
  }
})

// DELETE /users/experiences
// Delete an existing experience entry for a user
router.delete('/experiences', async (request, response) => {
  const { body } = request
  const options = { method: 'DELETE', body: JSON.stringify(body), headers }
  try {
    const resp = await fetch(`${BASE_URL}/experiences`, options)
    const experience = await resp.json()
    response.json(experience)
  } catch (e) {
    response.status(500)
  }
})

// PUT /users/:userId/summary
// Update the summary field for a user
router.put('/:userId/summary', verifyUserIdParam, async (request, response) => {
  const userId = request.params.userId
  const options = {
    method: 'PUT',
    body: JSON.stringify(request.body),
    headers,
  }
  try {
    const resp = await fetch(`${BASE_URL}/${userId}/summary`, options)
    const respJSON = await resp.json()
    response.json(respJSON)
  } catch (e) {
    response.status(500)
  }
})

// PUT /users/interviewer-details
// Update the interviewer details card for a user
router.put(
  '/:userId/interviewer-details',
  verifyUserIdParam,
  async (request, response) => {
    const userId = request.params.userId
    const options = {
      method: 'PUT',
      body: JSON.stringify(request.body),
      headers,
    }
    try {
      const resp = await fetch(
        `${BASE_URL}/${userId}/interviewer-details`,
        options
      )
      const respJSON = await resp.json()
      response.json(respJSON)
    } catch (e) {
      response.status(500)
    }
  }
)

// TODO: Remove this route
// GET /users/interviewer
// Retrieves a list of interviewers and their associated skills
// Returns an array of objects, each containing the interviewer's name and their skills
router.get('/interviewer', async (req, res) => {
  const BASE_URL = `${BASE_URL}/interviewer`
  const options = { method: 'GET', headers }
  try {
    const resp = await fetch(BASE_URL, options)
    const data = await resp.json()
    res.json(data)
  } catch (e) {
    res.status(500)
  }
})

export default router
