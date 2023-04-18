import { Card, Divider, Button, Space, Tag } from "antd"
import { fieldMapping } from "../utils/constants"
import dayjs from 'dayjs'
import { useDispatch, useSelector } from "react-redux"
import { userSelector } from "../store/userSlice"
import { deleteInterview } from "../api/interview"
import { deleteInterview as deleteInterviewFromStore } from '../store/interviewsSlice'
import useMessage from "antd/es/message/useMessage"

const InterviewCard = (interview) => {
  const { 
    _id,
    time, 
    interviewer, 
    interviewee, 
    preferences, 
    url,
    isPaid, 
    setOpenFeedbackForm,
    setCurrTime,
    setCurrRecipient,
    setIsInterviewer,
  } = interview
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const [messageApi, contextHolder] = useMessage()
  const { _id: interviewerId, andrewId: interviewerAndrewId, firstName: interviewerFirstName, lastName: interviewerLastName } = interviewer
  // eslint-disable-next-line
  const { andrewId: intervieweeAndrewId, firstName: intervieweeFirstName, lastName: intervieweeLastName } = interviewee

  const isInterviewer = user._id === interviewerId
  const { field, interviewer: interviewerType, difficulty } = preferences
  const isUpcoming = dayjs().isBefore(dayjs(time * 1000))
  const isWithinHour = dayjs().add(1, 'day').isAfter(dayjs(time * 1000))
  const formattedTime = dayjs(time * 1000).format('MM/DD/YY h A')
  // eslint-disable-next-line
  const toBePaid = !isUpcoming && !isPaid && !isInterviewer

  const handleLaunch = () => {
    window.open(url, '_blank');
  }

  const handleDelete = async () => {
    try {
      await deleteInterview(_id)
      dispatch(deleteInterviewFromStore({ _id }))
      messageApi.open({ type: 'success', content: 'Successfully deleted interview!'})
    } catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: 'Failed to delete interview.'})
    }
  }
  console.log(isWithinHour)
  return (
    <Card className='w-10 m-3'>
      {contextHolder}
      <Space direction='vertical' className='text-center'>
        <Card.Meta
          className='align-center'
          avatar={fieldMapping[field].icon}
          title={formattedTime}
        ></Card.Meta>
        <Divider />
        <p>
          {fieldMapping[field].string} with a {interviewerType}
        </p>
        {
          isInterviewer
          ?
          <p>Interviewee: {intervieweeAndrewId}</p>
          :
          <p>Interviewer: {interviewerAndrewId}</p>
        }
        <p>Level: {difficulty}</p>
        {toBePaid ? <Tag color="volcano">To be paid</Tag> : null}
        <Divider />
        {isUpcoming ? (
          <>
            <>
              <Button type="primary" disabled={!isWithinHour} onClick={handleLaunch}>
                Launch Meeting
              </Button> 
              {!isWithinHour ? <p>Launch within an hour of interview</p> : null}
            </>
            <>
              <Button danger type="primary" disabled={isWithinHour} onClick={handleDelete}>
                Delete
              </Button>
              Cancel up to an hour within interview
            </>
          </>)
          :
          <>
            {toBePaid ? <Button danger type="default">Pay</Button> : null}
            <Button
              type='default'
              onClick={(e) => {
                e.stopPropagation()
                setIsInterviewer(
                  (interviewerFirstName === user.firstName && interviewerLastName === user.lastName) ? 
                    false :
                    true
                )
                setCurrRecipient(
                  (interviewerFirstName === user.firstName && interviewerLastName === user.lastName) ? 
                    `${intervieweeFirstName} ${intervieweeLastName}` :
                    `${interviewerFirstName} ${interviewerLastName}`
                  )
                setOpenFeedbackForm(true)
                console.log("TRY: ", (interviewerFirstName === user.firstName && interviewerLastName === user.lastName) ? 
                    `${intervieweeFirstName} ${intervieweeLastName}` :
                    `${interviewerFirstName} ${interviewerLastName}`)
                
                setCurrTime(time)
              }}
            >
              Add or Edit Feedback
              </Button>
          </>
        }
      </Space>
    </Card>
  )
}

export default InterviewCard
