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
  const [currRecipient, setCurrRecipient] = useState('')
  const [isInterviewer, setIsInterviewer] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [currTime, setCurrTime] = useState('')
  
  const upcomingInterviews = interviews.filter((interview) =>
    now.isBefore(dayjs(interview.time * 1000))
  )
  const completedInterviews = interviews.filter(
    (interview) => !now.isBefore(dayjs(interview.time * 1000))
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
        <Typography.Title level={2} className="upcoming-interviews">Upcoming Interviews</Typography.Title>
      </Row>
      <Row>
        {upcomingInterviews.map((interview, i) => (
          <InterviewCard
            {...interview}
            setCurrTime={setCurrTime}
            setCurrRecipient={setCurrRecipient}
            setIsInterviewer={setIsInterviewer}
            setOpenFeedbackForm={setOpenFeedbackForm}
            key={i}
          />
        ))}
      </Row>
      <Divider />
      <Row>
        <Typography.Title level={2} className="completed-interviews">Completed Interviews</Typography.Title>
      </Row>
      <Row>
        {completedInterviews.map((interview, i) => (
          <InterviewCard
            {...interview}
            setOpenFeedbackForm={setOpenFeedbackForm}
            setCurrTime={setCurrTime}
            setCurrRecipient={setCurrRecipient}
            setIsInterviewer={setIsInterviewer}
            key={i}
          />
        ))}
      </Row>
      <Row justify='center mb-5'>
        <InterviewModal
          open={openInterviewModal}
          setOpen={setOpenInterviewModal}
        />
        <Button type='primary' onClick={() => setOpenInterviewModal(true)} className='create-interview'>
          Create new interview
        </Button>
      </Row>
      <FeedbackFormModal
        open={openFeedbackForm}
        setOpen={setOpenFeedbackForm}
        time={currTime}
        currRecipient={currRecipient}
        isInterviewer={isInterviewer}
      />
    </div>
  )
}

export default DashboardPage
