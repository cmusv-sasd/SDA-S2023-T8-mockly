import express from 'express'
import cors from 'cors'
import Feedback from './feedback/ConcreteFeedbackQuestions'
import LanguageDecorator from "./feedback/LanguageDecorator";
import TechnicalDecorator from "./feedback/TechnicalDecorator";
import ProfessionalismDecorator from './feedback/ProfessionalismDecorator';
import FeedbackController from './controllers/FeedbackController'
import FeedbackDecoratorController from './controllers/FeedbackDecoratorController';
import * as Database from './util/Database'

const PORT = parseInt(process.env.PORT || '3002')

const app = express().use(
  cors({
    origin: 'http://localhost:3001',
  })
).use(express.json())

Database.connect()

app.get('/api/', (req, res) => {
  
  res.json({ message: 'Hello from Feedback' })
})


app.get('/feedbackAll', async (request, response) => {
  try {
    const receivedFeedback = await FeedbackController.getAll()
    response.json(receivedFeedback)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.get('/feedbackQuestionsAll', async (request, response) => {
  try {
    const receivedFeedback = await FeedbackDecoratorController.getAll()
    response.json(receivedFeedback)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.get('/feedback', async (request, response) => {
  const { revieweeName } = request.query
  try {
    const receivedFeedback = await FeedbackController.getFeedback(revieweeName )
    response.json(receivedFeedback)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.post('/feedback', async (request, response) => {
  const { answers , reviewer, time, reviewee, questions, isInterviewer} = request.body
  try {
    const feedback= await FeedbackController.create(reviewer, reviewee, time, isInterviewer, questions, answers)
    response.json(feedback)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.get('/feedbackQuestions', async (request, response) => {
  const { userName } = request.query
  try {
    const receivedQuestions = await FeedbackDecoratorController.getQuestions(userName)
    response.json(receivedQuestions)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.post('/feedbackQuestions', async (request, response) => {
  //  const { userName } = request.params
  const { userName } = request.body
  //  const {isInterviewer, questions} = request.body
  try {
    const modifiedQuestions= await FeedbackDecoratorController.create(userName)
    response.status(200).json(modifiedQuestions)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.patch('/feedbackQuestions/:userName', async (request, response) => {
  const userName = request.params.userName
  const {isInterviewer, questions} = request.body
  try {
    const modifiedQuestions= await FeedbackDecoratorController.modifyFeedbackQuestions(userName, questions, isInterviewer)
    response.status(200).json(modifiedQuestions)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.get('/test', (req, res) => {
  const feedbackObj = new Feedback({},{
    reviewer: 'a',
    reviewee: 'b',
    answers: {}
  })
  const l1 = new LanguageDecorator(feedbackObj)
  const t1 = new  TechnicalDecorator(l1)
  const p1 = new ProfessionalismDecorator(t1)

  p1.addQuestions()
  res.json(feedbackObj.toObject())
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
