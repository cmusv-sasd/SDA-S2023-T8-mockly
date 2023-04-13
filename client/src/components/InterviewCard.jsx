import { Card, Divider, Button, Space, Tag } from "antd"
import { fieldMapping } from "../utils/constants"
import dayjs from 'dayjs'

const InterviewCard = (interview) => {
  const { time, interviewer, preferences, isPaid, setSelectedFeedbackForm,
    setOpenFeedbackForm,
    setCurrTime,
    setCurrInterviewer, } = interview
  const { andrewId, firstName, lastName } = interviewer

  const { field, interviewer: interviewerType, difficulty } = preferences
  const isUpcoming = dayjs().isBefore(dayjs(time * 1000))
  const formattedTime = dayjs(time * 1000).format('MM/DD/YY h A')
  // eslint-disable-next-line
  let toBePaid = !isUpcoming && !isPaid
  toBePaid = true

  const handleLaunch = () => {
    console.log('launch meeting')
  }

  return (
    <Card className='w-10 m-3'>
      <Space direction='vertical' className='text-center'>
        <Card.Meta
          avatar={fieldMapping[field].icon}
          title={formattedTime}
        ></Card.Meta>
        <Divider />
        <p>
          {fieldMapping[field].string} with a {interviewerType}
        </p>
        <p>Interviewer: {andrewId}</p>
        <p>Level: {difficulty}</p>
        {toBePaid ? <Tag color="volcano">To be paid</Tag> : null}
        <Divider />
        {isUpcoming ? (
          <>
            <Button type="primary" onClick={handleLaunch}>Launch Meeting</Button>
            <Button danger type="primary">Delete</Button>
          </>)
          :
          <>
            {toBePaid ? <Button danger type="default">Pay</Button> : null}
            <Button
              type='default'
              onClick={(e) => {
                e.stopPropagation()
                //  this should be an ID instead
                setSelectedFeedbackForm(`${firstName} ${lastName}` + time)
                setOpenFeedbackForm(true)
                setCurrInterviewer(`${firstName} ${lastName}`)
                setCurrTime(time)
              }}
            >
              Complete Feedback
              </Button>
          </>
        }
      </Space>
    </Card>
  )
}

export default InterviewCard
