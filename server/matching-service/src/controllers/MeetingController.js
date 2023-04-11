import { google } from 'googleapis'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

dotenv.config()
class MeetingController {
  constructor() {

  }

  async #authorize() {
    try {
      const credentials = JSON.parse(process.env.TOKEN);
      return google.auth.fromJSON(credentials)
    } catch (err) {
      throw new Error('Failed to authenticate.')
    }
  }

  async createMeeting(intervieweeDetails, interviewerDetails, preferences, time) {
    const auth = await this.#authorize()
    const { andrewId: interviewee, email: intervieweeEmail } = intervieweeDetails
    const { andrewId: interviewer, email: interviewerEmail } = interviewerDetails
    const summary = `Mockly Interview`
    const { field } = preferences
    const fieldString = field[0] + field.substring(1).replace(' ').toLowerCase()
    const description = `Interviewer: ${interviewer}, Interviewee: ${interviewee}. Subject: ${fieldString}`
    const resource = {
      start: { dateTime: dayjs(time), timeZone: 'America/Los_Angeles' },
      end: { dateTime: dayjs(time).add(1, 'hour').toISOString(), timeZone: 'America/Los_Angeles' },
      attendees: [{ email: intervieweeEmail }, { email: interviewerEmail }],
      conferenceData: {
        createRequest: {
          requestId: 'mockly-request',
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      summary,
      description,
    }
    const calendar = google.calendar({version: 'v3', auth})
    try {
      const { data } = await calendar.events
      .insert({
        calendarId: 'primary',
        resource: resource,
        conferenceDataVersion: 1,
      })
      return data
    } catch (e) {
      return e
    }
  }
}

export default new MeetingController()
