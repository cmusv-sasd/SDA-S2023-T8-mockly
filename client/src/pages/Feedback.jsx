import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//  import { Row, Col } from 'antd'
//  import { fetchUserAPI } from '../api/userProfile'
import { setFeedbackQuestions, feedbackSelector } from '../store/feedbackSlice'
// eslint-disable-next-line no-unused-vars
import FeedbackForm from '../components/FeedbackHistory/FeedbackForm'

const FeedbackPage = () => {
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const [openFeedbackForm, setOpenFeedbackForm] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [selectedFeedbackForm, setSelectedFeedbackForm] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const feedback = useSelector(feedbackSelector)
  useEffect(() => {
    const getFeedback = async () => {
      try {
        /*
        const response = await fetchUserAPI()
        
        console.log('Profile Page', response)
        */
        //  this will be replaced with fetching the questions
        //  This uses dummy data for now
        const response = {
          time: '2019-01-25',
          reviewee: 'userA',
          questions: {
            B1: {
              question: 'How would you rate this interview experience?',
              type: '1-5',
            },
            B2: { question: 'Any additional comments?', type: 'text' },
            L1: {
              question:
                "I'm a foreigner and my english skills aren't too good. Did you understand what I was saying?",
              type: '1-5',
            },
            L2: {
              question: 'Any additional feedback on my speech?',
              type: 'text',
            },
            T1: {
              question: 'Were my technical questions too easy or too difficult',
              type: '1-5',
            },
            T2: {
              question: 'Any additional feedback on my technical questions?',
              type: 'text',
            },
            P1: { question: 'Was the interview too lax?', type: '1-5' },
            P2: { question: 'Was the interview too formal?', type: '1-5' },
            P3: {
              question: 'Any additional feedback on my professionalism?',
              type: 'text',
            },
          },
        }

        console.log('done')
        dispatch(setFeedbackQuestions(response))
      } catch (error) {
        console.error(error)
      }
    }
    getFeedback()
  }, [dispatch])
  return (
    <div>
      <FeedbackForm
        open={openFeedbackForm}
        setOpen={setOpenFeedbackForm}
        selectedFeedbackForm={selectedFeedbackForm}
      />
    </div>
  )
}

export default FeedbackPage
