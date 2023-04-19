
import { Router } from 'express'
import fetch from 'node-fetch'
import { headers } from '../utils/constants'

export default Router()

  .post('/addBaseFeedbackQuestions', async (request, response) => {
    const { body } = request
    const options = { method: 'POST' , body: JSON.stringify(body), headers }
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedbackQuestions`, options)
      const receivedQuestions = await resp.json()
      response.json(receivedQuestions)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })


  