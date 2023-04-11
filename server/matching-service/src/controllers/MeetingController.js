import { google } from 'googleapis'
import dayjs from 'dayjs'
import dotenv from 'dotenv'

dotenv.config()

const resource = {
  start: { dateTime: dayjs(new Date()).add(1, 'day').toISOString(), timeZone: 'America/Los_Angeles' },
  end: { dateTime: dayjs(new Date()).add(1, 'day').add(1, 'hour').toISOString(), timeZone: 'America/Los_Angeles' },
  attendees: [{ email: "vishaalagartha@gmail.com" }],
  conferenceData: {
    createRequest: {
      requestId: "sample123",
      conferenceSolutionKey: { type: "hangoutsMeet" },
    },
  },
  summary: "sample event with Meet link",
  description: "sample description",
}

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

  async createMeeting() {
    const auth = await this.#authorize()
    console.log(auth)
    const calendar = google.calendar({version: 'v3', auth})
    try {
      const data = await calendar.events
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

export default MeetingController
