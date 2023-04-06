import express from 'express'
import cors from 'cors'
import MatchController from './controllers/MatchController'
import PreferenceBuilder from './preferences/PreferenceBuilder'
import * as Database from './utils/Database'
import fetch from 'node-fetch'
import { PORTS } from './utils/constants'

const PORT = parseInt(process.env.PORT || '3003')

const app = express().use(
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3004']
  })
).use(express.json())

Database.connect()

app.get('/interviews', async (request, response) => {
  const { userId } = request.query
  try {
    const interviews = await MatchController.getByUserId(userId)
    response.json(interviews)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.post('/matches', async (request, response) => {
  const { interviewer, field, difficulty, times } = request.body
  const preferences = { interviewer, field, difficulty }
  const schedule = times
  try {
    const matches = await MatchController.findMatches(preferences, schedule)
    response.json(matches)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.post('/interviews', async (request, response) => {
  const { interviewer, interviewee, field, difficulty, interviewerType, time } = request.body
  const preference = new PreferenceBuilder().field(field).difficulty(difficulty).interviewer(interviewerType).make()
  const preferenceObj = preference.toObject()
  try {
    console.log(interviewee, interviewer, preferenceObj, time)
    const interview = await MatchController.create(interviewee, interviewer, preferenceObj, time)
    const res = await fetch(`http://mockly-profile-service:${PORTS.PROFILE}/users/${interview.interviewer}`, { method: 'GET' })
    const interviewerDetails = await res.json()
    console.log('interview', interview.toObject())
    console.log('details', interviewerDetails)
    const data = { ...interview.toObject(), interviewer: interviewerDetails }
    response.json(data)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.patch('/interviews/:interviewId', async (request, response) => {
  const { interviewId } = request.params
  const interview = request.body
  try {
    const modifiedInterview = await MatchController.modifyInterview(interviewId, interview)
    response.status(200).json(modifiedInterview)
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.delete('/interviews/:interviewId', async (request, response) => {
  const { interviewId } = request.params
  try {
    await MatchController.deleteInterview(interviewId)
    response.status(204).send({ message: 'Successfully deleted interview.' })
  } catch (e) {
    console.error(e)
    response.status(500).send({ message: 'Internal server error.'})
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
