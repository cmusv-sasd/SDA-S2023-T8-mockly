
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
  .post('/addFeedbackQuestions', async (request, response) => {
    const { body } = request
    const options = { method: 'POST' , body: JSON.stringify(body), headers }
    console.log("IN POST  FQ")
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedbackQuestions`, options)
      const receivedQuestions = await resp.json()
      console.log("RQ in POST:", receivedQuestions)
      response.json(receivedQuestions)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  .patch('/feedbackQuestions/:userName', async (request, response) => {
    const { body } = request
    const options = { method: 'PATCH' , body: JSON.stringify(body), headers }
    const { userName } = request.params.userName
    try {
      const resp = await fetch(`http://mockly-feedback-service:3002/feedbackQuestions/${userName}`, options)
      const receivedQuestions = await resp.json()
      console.log("RQ in PATCH:", receivedQuestions)
      response.json(receivedQuestions)
    } catch (e) {
      response.status(500).send({ message: 'Internal server error '})
    }
  })
  