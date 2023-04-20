import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FeedbackRow from '../components/FeedbackHistory/FeedbackRow'
import { fetchFeedback } from '../api/feedback'
import {
  setFeedbackHistory,
  feedbackHistorySelector,
} from '../store/feedbackHistorySlice'
import FeedbackModal from '../components/FeedbackHistory/FeedbackModal'
import { userSelector } from '../store/userSlice'

const FeedbackHistoryPage = () => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(0)
  const feedbackHistory = useSelector(feedbackHistorySelector)
  useEffect(() => {
    const getFeedbackHistory = async () => {
      try {
        const res = await fetchFeedback(user.firstName + ' ' + user.lastName)
        dispatch(setFeedbackHistory(res))
      } catch (error) {
        console.error(error)
      }
    }
    getFeedbackHistory()
  }, [dispatch, user._id])
  return (
    <div className="feedback-history">
      {feedbackHistory.map((each, index) => {
        return (
          <FeedbackRow
            key={`${each.reviewer}-${each.time}`}
            time={each.time}
            answers={each.answers}
            reviewer={each.reviewer}
            setSelectedFeedback={setSelectedFeedback}
            setOpenFeedbackModal={setOpenFeedbackModal}
            index={index}
          />
        )
      })}
      <FeedbackModal
        open={openFeedbackModal}
        setOpen={setOpenFeedbackModal}
        selectedFeedback={selectedFeedback}
      />
    </div>
  )
}

export default FeedbackHistoryPage
