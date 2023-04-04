import Match from "../models/Match"
import PreferenceBuilder from "../preferences/PreferenceBuilder"
import fetch from 'node-fetch'
import { PORTS } from '../utils/constants'

class MatchController {
  /*
  * Create a match between a interviewer and interviewee
  */
  async create(interviewer, interviewee, preferences, time) {
    // TODO: set url
    const match = new Match({ interviewer, interviewee, preferences, time, url: '', isPaid: false })
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
  * TODO:
  * Delete interview by id
  */
  async deleteById(interviewId) {
    const interview = await Match.deleteById(interviewId).exec()
    return interview
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
    // TODO: filter by schedule
    // return filteredInterviewers
    const matches = allInterviewers.map(interviewer => 
      ({ 
        interviewer: interviewer._id,
        time: new Date().getTime(),
      }))
    return matches
  }
}

export default new MatchController
