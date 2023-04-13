import Match from "../models/Match"
import PreferenceBuilder from "../preferences/PreferenceBuilder"
import fetch from 'node-fetch'
import { PORTS } from '../utils/constants'
import MeetingController from "./MeetingController"

class MatchController {
  /*
  * Create a match between a interviewer and interviewee
  */
  async create(interviewer, interviewee, preferences, time) {
    const interviewerRes = await fetch(`http://mockly-profile-service:${PORTS.PROFILE}/users/${interviewer}`, { method: 'GET' })
    const intervieweeRes = await fetch(`http://mockly-profile-service:${PORTS.PROFILE}/users/${interviewee}`, { method: 'GET' })
    const interviewerDetails = await interviewerRes.json()
    const intervieweeDetails = await intervieweeRes.json()
    const meeting = await MeetingController.createMeeting(intervieweeDetails, interviewerDetails, preferences, time)
    const { hangoutLink: url } = meeting
    const match = new Match({ interviewer, interviewee, preferences, time, url, isPaid: false })
    await match.save()
    return match
  }

  /*
  * TODO:
  * Find all of a user's interviews by user id
  */
  async getByUserId(userId) {
    const interviews = await Match.find({ $or: [ { interviewee: userId }, { interviewee: userId } ] }).exec()
    return interviews
  }
  
  /*
  * Find all potential matches given preferences and schedule
  */
  async findMatches(preferences, schedule) {
    const { interviewer, field, difficulty } = preferences
    const preference = new PreferenceBuilder().interviewer(interviewer).field(field).difficulty(difficulty).make()
    const res = await fetch(`http://mockly-profile-service:${PORTS.PROFILE}/users`, { method: 'GET' })
    const allInterviewers = await res.json()
    const filteredInterviewers = allInterviewers.filter(interviewer => preference.isMatch(interviewer))
    const matches = []
    filteredInterviewers.forEach(interviewer => {
      const overlappingTimes = MeetingController.matchSchedule(schedule, interviewer.time)
      overlappingTimes.forEach(time => {
        matches.push({ username: interviewer.andrewId, interviewer: interviewer._id, time })
      })
    })
    return matches
  }


  /*
  * Modify interview by id
  */ 
  async modifyInterview(interviewId, newInterview) {
    const interview = await Match.findByIdAndUpdate(interviewId, newInterview, { new: true })
    if (interview) {
      return interview
    } else {
      throw new Error('Failed to update interview.')
    }
  }

  /*
  * Delete interview by id
  */ 
    async deleteInterview(interviewId) {
      try {
        await Match.deleteById(interviewId)
      } catch (e) {
        throw new Error('Failed to delete interview.')
      }
    }
}

export default new MatchController
