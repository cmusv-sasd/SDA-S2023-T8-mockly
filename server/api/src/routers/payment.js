import { Router } from 'express'
import fetch from 'node-fetch'
import { validate } from '../utils/token'
import { setUserIdFromToken } from '../middlewares/setUserIdFromToken'
import { headers } from '../utils/constants'
import { verifyUserIdParam } from '../middlewares/verifyUserIdParam'


const router = Router()
const BASE_URL = 'http://mockly-payment-service:3004/payment'


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
    console.log(e)
    response.status(500).json({ message: 'Internal Server Error', error: e })
  }
})

// GET /payment/confirm
// Confirm payment
router.get('/confirm', async (req, res) => {t
  try {
    let urlQuery = ''
    for (const key in request.query) {
      if (request.query.hasOwnProperty(key)) {
        urlQuery += `${key}=${request.query[key]}&`
      }
    }
    urlQuery = urlQuery.slice(0, -1)

    let requestURL = `${BASE_URL}/confirm?${urlQuery}`
    const resp = await fetch(requestURL, {
      method: 'GET',
      headers,
    })
    response.json(resp)
  } catch (e) {
    console.log(e)
    response.status(500).json({ message: 'Internal Server Error', error: e })
  }
})

// GET /payment/cancel
// Cancel payment
router.get('/cancel', async (req, res) => {t
  try {
    let urlQuery = ''
    for (const key in request.query) {
      if (request.query.hasOwnProperty(key)) {
        urlQuery += `${key}=${request.query[key]}&`
      }
    }
    urlQuery = urlQuery.slice(0, -1)
    let requestURL = `${BASE_URL}/cancel?${urlQuery}`
    const resp = await fetch(requestURL, {
      method: 'GET',
      headers,
    })
    // TODO: redirect back to meetings
    response.json(resp)
  } catch (e) {
    console.log(e)
    response.status(500).json({ message: 'Internal Server Error', error: e })
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
    console.log(e)
    response.status(500).json({ message: 'Internal Server Error', error: e })
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
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })
    const paymentMethod = await resp.json()
    response.json(paymentMethod)
  } catch (e) {
    console.log(e)
    response.status(500).json({ message: 'Internal Server Error', error: e })
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
    if (deleteResp) {
      response.status(200).json(deleteResp)
    }
    else {
      response.status(400).json({ error: 'Entry does not exist'})
    }
  } catch (e) {
    console.log(e)
    response.status(500).json({ message: 'Internal Server Error', error: e })
  }
})


export default router