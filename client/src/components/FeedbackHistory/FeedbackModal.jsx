import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { feedbackHistorySelector } from '../../store/feedbackHistorySlice'
//
import { Typography } from 'antd';

const {  Text} = Typography;
/*


This file is the Modal that people see that shows the corresponding answers for the
feedback they receive


*/
const FeedbackModal = ({ open, setOpen, selectedFeedback }) => {
  const feedbackHistory = useSelector(feedbackHistorySelector)
  const feedback = feedbackHistory[selectedFeedback]
  return (
    <Modal open={open} onCancel={() => setOpen(false)} footer={null} width={1000}>
      {feedback &&
        feedback.questions &&
        Object.keys(feedback.questions).map((key) => {
          let answer = feedback.answers[key] ? feedback.answers[key] : "N/A"
          if(!isNaN(answer) && feedback.questions[key].type === "1-5"){
            answer += " / 5"
          }
          return (
            <div key={`${selectedFeedback}-${key}`}>
              <Text strong>{feedback.questions[key].question}</Text>
              <p>{answer }</p>
            </div>
          )
        })}
    </Modal>
  )
}

export default FeedbackModal
