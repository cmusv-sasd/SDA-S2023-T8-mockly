import { Router } from 'express'
import fetch from 'node-fetch'
import { generate } from '../utils/token'

const router = Router()
const BASE_URL = 'http://mockly-profile-service:3005/users'
const HEADERS = {
  'Content-Type': 'application/json',
}

// POST /register
// Register new User
router.post('/', async (req, res) => {
  try {
    const { body } = req
    // sending POST request to /users to create new user if not exist
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: HEADERS,
    })
    const responseJSON = await response.json()
    if (response.status == 201) {
      // new user created
      const token = generate(responseJSON.user._id)
      res.status(response.status).json({ token, userId: responseJSON.user._id })
    } else {
      /**
       * 400 - Missing required fields
       * 409 - AndrewID is already taken
       */
      res.status(response.status).json(responseJSON)
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
