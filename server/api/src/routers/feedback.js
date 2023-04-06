
import { Router } from 'express'
import fetch from 'node-fetch'
import { headers } from '../utils/constants'

export default Router()
  .get('/feedback', async (request, response) => {
    const options = { method: 'GET', headers }
    const { revieweeName } = request.query
    console.log("this is the revieweeNameD", revieweeName)
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedback?revieweeName=${revieweeName}`, options)
      const receivedFeedback = await resp.json()
      response.json(receivedFeedback)
    } catch (e) {
      console.log("in router feedback get")
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  
  .post('/addFeedback', async (request, response) => {
    const { body } = request
    const options = { method: 'POST', body: JSON.stringify(body), headers }
    console.log("in feedback api from server", options.body)
    try {
      console.log("IN HERE")
      const resp = await fetch('http://mockly-feedback-service:3002/feedback', options)
      const match = await resp.json()
      response.json(match)
    } catch (e) {
      console.log("IN ERROR")
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  