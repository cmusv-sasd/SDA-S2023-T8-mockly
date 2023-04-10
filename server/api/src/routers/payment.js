import { Router } from 'express'
import fetch from 'node-fetch'
import { validate } from '../utils/token'
import { setUserIdFromToken } from '../middlewares/setUserIdFromToken'
import { headers } from '../utils/constants'
import { verifyUserIdParam } from '../middlewares/verifyUserIdParam'


const router = Router()
const BASE_URL = 'http://mockly-profile-service:3004/payment'


// POST /payment/
// Process a payment request
router.post('/', async (request, response) => {
  try {
    const { body } = request
    const resp = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })
    const paymentResponse = await resp.json()
    response.json(paymentResponse)
  } catch (e) {
    response.status(500).send('Internal Server Error')
  }
})

// GET /payment/payment-method
// Get payment method
router.get('/payment-method', async (request, response) => {
  try {
    const { userId } = request.query
    let requestURL = `${BASE_URL}/payment-method?userId=${userId}`
    const resp = await fetch(requestURL, {
      method: 'GET',
      headers,
    })
    const paymentMethod = await resp.json()
    response.json(paymentMethod)
  } catch (e) {
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

// POST /payment/payment-method
// Create/Update payment method
router.post('/payment-method', async (request, response) => {
  try {
    const { userId } = request.query
    const { body } = request
    let requestURL = `${BASE_URL}/payment-method?userId=${userId}`
    const resp = await fetch(requestURL, {
      method: 'GET',
      body: JSON.stringify(body),
      headers,
    })
    const paymentMethod = await resp.json()
    response.json(paymentMethod)
  } catch (e) {
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

// DELETE /payment/payment-method
// Delete payment method
router.delete('/payment-method', async (request, response) => {
  try {
    const { userId } = request.query
    let requestURL = `${BASE_URL}/payment-method?userId=${userId}`
    const resp = await fetch(requestURL, {
      method: 'DELETE',
      headers,
    })
    const deleteResp = await resp.json()
    response.json(deleteResp)
  } catch (e) {
    response.status(500).json({ message: 'Internal Server Error' })
  }
})


export default router