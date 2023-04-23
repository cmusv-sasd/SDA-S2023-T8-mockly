import { Card, Button } from "antd"
import dayjs from 'dayjs'
import "../../styles/feedback.css"

/*
This is the component in the history page that is the "rows" / "cards" of reviews people receive.

Clicking on "Expand" will open the FeedbackModal
*/


const FeedbackRow = (feedback) => {
  const { time, reviewer,setSelectedFeedback,index,setOpenFeedbackModal } = feedback
  const formattedTime = dayjs(time * 1000).format('MM/DD/YY h A')
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
