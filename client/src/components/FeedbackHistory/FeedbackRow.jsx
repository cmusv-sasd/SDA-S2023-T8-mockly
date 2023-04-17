import { Card, Button } from "antd"
import dayjs from 'dayjs'
import "../../styles/feedback.css"
/*


This file is the "rows" of feedback shown within the FeedbackHistory page.


*/
const FeedbackRow = (feedback) => {
  // eslint-disable-next-line no-unused-vars
  const { time, reviewer, answers,setSelectedFeedback,index,setOpenFeedbackModal } = feedback
  const formattedTime = dayjs(time).format('MM/DD/YY h A')
  return (
    <Card className="w-10 m-3" >
      <p> {formattedTime} | {reviewer} 
      <Button type="text" className="float-right"
        onClick={e => { e.stopPropagation(); setSelectedFeedback(index);setOpenFeedbackModal(true)}}
        >Expand</Button>
      </p>
    </Card>
  )
  
}

export default FeedbackRow
