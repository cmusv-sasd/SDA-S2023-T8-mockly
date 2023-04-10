import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FeedbackRow from '../components/FeedbackHistory/FeedbackRow'
//  import { Row, Col } from 'antd'
//  import { fetchUserAPI } from '../api/userProfile'
import { fetchFeedback } from '../api/feedback'
import {
  setFeedbackHistory,
  feedbackHistorySelector,
} from '../store/feedbackHistorySlice'
import FeedbackModal from '../components/FeedbackHistory/FeedbackModal'
import FeedbackQuestions from '../components/FeedbackHistory/FeedbackQuestions'
import { userSelector } from '../store/userSlice'

const FeedbackHistoryPage = () => {
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [selectedFeedback, setSelectedFeedback] = useState(0)
  const feedbackHistory = useSelector(feedbackHistorySelector)
  useEffect(() => {
    const getFeedbackHistory = async () => {
      try {
        //  this will be replaced with fetching the feedback you get
        //  This uses dummy data for now
        // eslint-disable-next-line no-unused-vars

        /*
        console.log("done");
        dispatch(setFeedbackHistory(response))
        */
        // eslint-disable-next-line no-unused-vars
        console.log(
          'user',
          user,
          user['firstName'],
          user.firstName + ' ' + user.lastName
        )
        const res = await fetchFeedback(user.firstName + ' ' + user.lastName)
        dispatch(setFeedbackHistory(res))
      } catch (error) {
        console.error(error)
      }
    }
    getFeedbackHistory()
  }, [dispatch])
  return (
    <div>
      <FeedbackQuestions />
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
