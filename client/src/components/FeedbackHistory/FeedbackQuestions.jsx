// eslint-disable-next-line no-unused-vars
import { Card, Modal, Slider, Input, Form, Button, Space } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import {
  // eslint-disable-next-line no-unused-vars
  setFeedbackQuestions,addQuestions
} from '../../store/feedbackQuestionsSlice'
import { userSelector } from '../../store/userSlice'
// eslint-disable-next-line no-unused-vars
import { feedbackQuestionsSelector } from '../../store/feedbackQuestionsSlice'
import { fetchFeedbackQuestions } from '../../api/feedback'
// eslint-disable-next-line no-unused-vars
const { TextArea } = Input
// eslint-disable-next-line no-unused-vars
const FeedbackQuestions = () => {
  // eslint-disable-next-line no-unused-vars
  const feedbackQuestions = useSelector(feedbackQuestionsSelector)
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const user = useSelector(userSelector)

  
  // eslint-disable-next-line no-unused-vars
  const onFinish = async (values) => {
    
    //  console.log('Success:', values)
    //  save to MongoDB
    try {
      //const questions = { questions: values }
      //  console.log('in onFinish', interviewer)
      /*
      setOpen(false)
      await createFeedback({
        questions: feedback.questions,
        answers: values,
        reviewer: `${user.firstName} ${user.lastName}`,
        time,
        reviewee: interviewer,
      })
      */
    } catch (e) {
      console.log(e)
    }
  }

  /*
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  */

  //
  useEffect(() => {
    const getFeedback = async () => {
      try {
        const res = await fetchFeedbackQuestions(user.firstName + ' ' + user.lastName)
        dispatch(setFeedbackQuestions(res))
      } catch (error) {
        console.error(error)
      }
    }
    getFeedback()
  }, [dispatch])
  return (
    <Card className="w-10 m-3" >
      Here
    </Card>
  )
}

export default FeedbackQuestions
