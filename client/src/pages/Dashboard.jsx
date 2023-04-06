import { Row, Button, Typography, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import InterviewCard from '../components/InterviewCard'
import InterviewModal from '../components/InterviewModal'
import { interviewsSelector } from '../store/interviewsSlice'
import { userSelector } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { fetchInterviews } from '../api/interview'
import { setInterviews } from '../store/interviewsSlice'

import dayjs from 'dayjs'
import FeedbackFormModal from '../components/FeedbackHistory/FeedbackFormModal'

const DashboardPage = () => {
  const [openInterviewModal, setOpenInterviewModal] = useState(false)
  const interviews = useSelector(interviewsSelector)
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const now = dayjs()
  //
  // eslint-disable-next-line no-unused-vars
  const [openFeedbackForm, setOpenFeedbackForm] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [selectedFeedbackForm, setSelectedFeedbackForm] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [currInterviewer, setCurrInterviewer] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [currTime, setCurrTime] = useState('')
  //

  const upcomingInterviews = interviews.filter((interview) =>
    now.isBefore(dayjs(interview.time))
  )
  const completedInterviews = interviews.filter(
    (interview) => !now.isBefore(dayjs(interview.time))
  )

  useEffect(() => {
    const loadInterviews = async () => {
      const res = await fetchInterviews(user._id)
      dispatch(setInterviews(res))
    }
    loadInterviews()
  }, [user._id])

  return (
    <div>
      <Row>
        <Typography.Title level={2}>Upcoming Interviews</Typography.Title>
      </Row>
      <Row>
        {upcomingInterviews.map((interview, i) => (
          <InterviewCard
            {...interview}
            setSelectedFeedbackForm={setSelectedFeedbackForm}
            setCurrTime={setCurrTime}
            setCurrInterviewer={setCurrInterviewer}
            key={i}
          />
        ))}
      </Row>
      <Divider />
      <Row>
        <Typography.Title level={2}>Completed Interviews</Typography.Title>
      </Row>
      <Row>
        {completedInterviews.map((interview, i) => (
          <InterviewCard
            {...interview}
            setSelectedFeedbackForm={setSelectedFeedbackForm}
            setOpenFeedbackForm={setOpenFeedbackForm}
            setCurrTime={setCurrTime}
            setCurrInterviewer={setCurrInterviewer}
            key={i}
          />
        ))}
      </Row>
      <Row justify='center mb-5'>
        <InterviewModal
          open={openInterviewModal}
          setOpen={setOpenInterviewModal}
        />
        <Button type='primary' onClick={() => setOpenInterviewModal(true)}>
          Create new interview
        </Button>
      </Row>
      <FeedbackFormModal
        open={openFeedbackForm}
        setOpen={setOpenFeedbackForm}
        selectedFeedbackForm={selectedFeedbackForm}
        time={currTime}
        interviewer={currInterviewer}
      />
    </div>
  )
}

export default DashboardPage
