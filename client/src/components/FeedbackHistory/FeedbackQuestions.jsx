import { Card, Form, Checkbox, Row, Col, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFeedbackQuestions
} from '../../store/feedbackQuestionsSlice'
import { userSelector } from '../../store/userSlice'
import { feedbackQuestionsSelector } from '../../store/feedbackQuestionsSlice'
import { fetchFeedbackQuestions, updateFeedbackQuestions, createFeedbackQuestions } from '../../api/feedback'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'

/*
This is the component in the Profile section where users select what types of feedback 
they want to receive
*/

const FeedbackQuestions = () => {
  const [messageApi, contextHolder] = useMessage()
  const [editing, setEditing] = useState(false)
  const feedbackQuestions = useSelector(feedbackQuestionsSelector)
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const [form] = useForm()

  const resetFeedback = async () => {
    try {
      if (!user.firstName || !user.lastName) return
      let res = await fetchFeedbackQuestions(user.firstName + ' ' + user.lastName)
      if(res === null || res.length <= 0){
        await createFeedbackQuestions(user.firstName + ' ' + user.lastName)
        res = await fetchFeedbackQuestions(user.firstName + ' ' + user.lastName)
      }
      const { questionsInterviewee, questionsInterviewer } = res
      dispatch(setFeedbackQuestions({ questionsInterviewee, questionsInterviewer }))
    } catch (error) {
      console.error(error)
    }
  }
   
  useEffect(() => {
    resetFeedback()
  }, [dispatch, user._id])

  useEffect(() => {
    const { questionsInterviewee, questionsInterviewer } = feedbackQuestions
    const intervieweeKeys = Object.keys(questionsInterviewee).map((q) => q[0])
    const interviewerKeys = Object.keys(questionsInterviewer).map((q) => q[0])
    const intervieweeValues = Object.values(intervieweeOptions).map(({ value }) => value).filter(v => intervieweeKeys.indexOf(v[0]) !== -1)
    const interviewerValues = Object.values(interviewerOptions).map(({ value }) => value).filter(v => interviewerKeys.indexOf(v[0]) !== -1)
    form.setFieldValue('interviewer', interviewerValues)
    form.setFieldValue('interviewee', intervieweeValues)
  }, [feedbackQuestions])

  const interviewerOptions = [
    { label: "Professionalism", value: "Professionalism" },
    { label: "Language", value: "Language" },
    { label: "Technical", value: "Technical" }
  ]

  const intervieweeOptions = [
    { label: "Professionalism", value: "Professionalism" },
    { label: "Language", value: "Language" },
    { label: "Technical", value: "Technical" }
  ]
  
  const handleCancelClick = async () => {
    setEditing(false)
    await resetFeedback()
  }

  const handleSave = async () => {
    try {
      const interviewerChecked = form.getFieldValue('interviewer')
      const intervieweeChecked = form.getFieldValue('interviewee')
      await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {questions: interviewerChecked, isInterviewer: true })
      await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {questions: intervieweeChecked, isInterviewer:false })
      setEditing(false)
    } catch(e) {
      console.error(e)
      messageApi.open({ type: 'error', conent: `Failed to update feedback questions with error ${e.message}`})
    }
  }


  return (
    <Card 
      title="Feedback Preferences" 
      className="user-profile-card feedback-details"
      extra={
        <Button type='text' onClick={() => setEditing(!editing)}>
          <EditOutlined />
        </Button>
      }>
      {contextHolder}
      <Form
        form={form} 
        name="questionsForm"        
        autoComplete='off'
        layout="horizontal"
      >
        <Row>
          <Col  span={12}>
            As an interviewer, what would you like to receive feedback about? 
            <Form.Item name="interviewer">
              <Checkbox.Group disabled={!editing} options={interviewerOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            As an interviewee, what would you like to receive feedback about? 
            <Form.Item name="interviewee">
              <Checkbox.Group disabled={!editing} options={intervieweeOptions} />
            </Form.Item>
          </Col>
        </Row>
        {editing ? 
        <Form.Item>
            <div
              className='user-card--button-container'
              style={{ marginTop: '8px' }}
            >
              <Button
                className='user-card--cancel-btn'
                type='default'
                shape='round'
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                className='user-card--save-btn'
                type='primary'
                shape='round'
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </Form.Item>
          : null}
      </Form>
    </Card>
  )
}

export default FeedbackQuestions
