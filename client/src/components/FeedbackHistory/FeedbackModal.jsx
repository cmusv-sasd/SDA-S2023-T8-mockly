import { Modal } from 'antd'
import { useSelector } from 'react-redux'
//  import dayjs from 'dayjs'
import { feedbackHistorySelector } from '../../store/feedbackHistorySlice'

const FeedbackModal = ({ open, setOpen, selectedFeedback }) => {
  const feedbackHistory = useSelector(feedbackHistorySelector)
  const feedback = feedbackHistory[selectedFeedback]
  console.log('THIS IS THE FEEDBACK', feedback)
  // eslint-disable-next-line no-unused-vars
  return (
    <Modal open={open} onCancel={() => setOpen(false)} width={1000}>
      {feedback &&
        feedback.questions &&
        Object.keys(feedback.questions).map((key) => {
          return (
            <div key={`${selectedFeedback}-${key}`}>
              <p>{feedback.questions[key].question}</p>
              <p>{feedback.answers[key]}</p>
            </div>
          )
        })}
    </Modal>
  )
}

export default FeedbackModal
