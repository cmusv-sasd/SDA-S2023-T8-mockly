import { Row, Button, Typography, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import InterviewCard from '../components/InterviewCard'
import InterviewModal from '../components/InterviewModal'
import { getPaymentMethod } from '../api/payment'
import { interviewsSelector } from '../store/interviewsSlice'
import { userSelector } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { fetchInterviews } from '../api/interview'
import { setInterviews } from '../store/interviewsSlice'

import dayjs from 'dayjs'
import FeedbackFormModal from '../components/FeedbackHistory/FeedbackFormModal'
import useMessage from 'antd/es/message/useMessage'

const DashboardPage = () => {
  const [openInterviewModal, setOpenInterviewModal] = useState(false)
  const interviews = useSelector(interviewsSelector)
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = useMessage()
  const now = dayjs()
  const [openFeedbackForm, setOpenFeedbackForm] = useState(false)
  const [currRecipient, setCurrRecipient] = useState('')
  const [isInterviewer, setIsInterviewer] = useState(false)
  const [currTime, setCurrTime] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)
  const [validPayment, setValidPayment] = useState(false)
  
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
    const loadPaymentMethod = async () => {
      const res = await getPaymentMethod(user._id)
      if (res.account && res.type) setValidPayment(true)
    }
    loadInterviews()
    loadPaymentMethod()
  }, [user._id])

  const handleCreateInterviewClick = () => {
    if (!validPayment) {
      messageApi.open({ type: 'error', content: 'Please set your payment method prior to creating any interviews!'})
    } else {
      setOpenInterviewModal(true)
    }
  }

  return (
    <div>
      {contextHolder}
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
            setIsUpdated={setIsUpdated}
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
            setIsUpdated={setIsUpdated}
            key={i}
          />
        ))}
      </Row>
      <Row justify='center mb-5'>
        <InterviewModal
          open={openInterviewModal}
          setOpen={setOpenInterviewModal}
        />
        <Button type='primary' onClick={handleCreateInterviewClick} className='create-interview'>
          Create new interview
        </Button>
      </Row>
      <FeedbackFormModal
        open={openFeedbackForm}
        setOpen={setOpenFeedbackForm}
        time={currTime}
        currRecipient={currRecipient}
        isInterviewer={isInterviewer}
        isUpdated={isUpdated}
        setIsUpdated={setIsUpdated}
      />
    </div>
  )
}

export default DashboardPage
