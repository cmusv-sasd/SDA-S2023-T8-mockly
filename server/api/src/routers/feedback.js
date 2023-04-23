
import { Router } from 'express'
import fetch from 'node-fetch'
import { headers } from '../utils/constants'

export default Router()
  .get('/feedback', async (request, response) => {
    const options = { method: 'GET', headers }
    const { revieweeName } = request.query
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedback?revieweeName=${revieweeName}`, options)
      const receivedFeedback = await resp.json()
      response.json(receivedFeedback)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  .get('/feedbackQuestions', async (request, response) => {
    const options = { method: 'GET', headers }
    const { userName } = request.query
    console.log("UN is :", userName)
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedbackQuestions?userName=${userName}`, options)
      const receivedQuestions = await resp.json()
      console.log("RQ:", receivedQuestions)
      response.json(receivedQuestions)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  
  .post('/addFeedback', async (request, response) => {
    const { body } = request
    const options = { method: 'POST', body: JSON.stringify(body), headers }
    try {
      const resp = await fetch('http://mockly-feedback-service:3002/feedback', options)
      const match = await resp.json()
      response.json(match)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  //  we do not really need this POST since it was extracted to the feedbackQeustions.js
  //      so in account creation it uses the POST from feedbackQuestions.js
  //  However, leave this here in case we ever need to add questions (like for custom questions) and need authentication before adding
  .post('/addFeedbackQuestions', async (request, response) => {
    const { body } = request
    const options = { method: 'POST' , body: JSON.stringify(body), headers }
    console.log("IN POST  FQ")
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedbackQuestions`, options)
      const receivedQuestions = await resp.json()
      response.json(receivedQuestions)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  //  update what type of feedback the user wants
  .patch('/feedbackQuestions/:userName', async (request, response) => {
    const { body } = request
    const options = { method: 'PATCH' , body: JSON.stringify(body), headers }
    const userName  = request.params.userName
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedbackQuestions/${userName}`, options)
      const receivedQuestions = await resp.json()
      response.json(receivedQuestions)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  