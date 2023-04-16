import { Card, Form, Checkbox, Row, Col } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFeedbackQuestions, addQuestions
} from '../../store/feedbackQuestionsSlice'
import { userSelector } from '../../store/userSlice'
import { feedbackQuestionsSelector } from '../../store/feedbackQuestionsSlice'
import { fetchFeedbackQuestions, updateFeedbackQuestions, createFeedbackQuestions } from '../../api/feedback'
import { useForm } from 'antd/es/form/Form'

// eslint-disable-next-line no-unused-vars
const FeedbackQuestions = () => {
  const feedbackQuestions = useSelector(feedbackQuestionsSelector)
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
  const [form] = useForm()

  const interviewerOptions = [
    { label: "Professionalism", value: "Professionalism" },
    { label: "Language", value: "Language" },
    { label: "Technical", value: "Technical" }
  ];
  const intervieweeOptions = [
    { label: "Professionalism", value: "Professionalism" },
    { label: "Language", value: "Language" },
    { label: "Technical", value: "Technical" }
  ];

  const onChangeInterviewer = async (checkedValues) => {
    const res = await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {questions:checkedValues, isInterviewer:true})
    dispatch(addQuestions({questionsInterviewer: res.questionsInterviewer}))
  }

  const onChangeInterviewee = async (checkedValues) => {
    const res = await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {questions:checkedValues, isInterviewer:false})
    dispatch(addQuestions({questionsInterviewee: res.questionsInterviewee}))
  }

  useEffect(() => {
    const getFeedback = async () => {
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
    getFeedback()
  }, [dispatch, user])

  useEffect(() => {
    const { questionsInterviewee, questionsInterviewer } = feedbackQuestions
    const intervieweeKeys = Object.keys(questionsInterviewee).map((q) => q[0])
    const interviewerKeys = Object.keys(questionsInterviewer).map((q) => q[0])
    const intervieweeValues = Object.values(intervieweeOptions).map(({ value }) => value).filter(v => intervieweeKeys.indexOf(v[0]) !== -1)
    const interviewerValues = Object.values(interviewerOptions).map(({ value }) => value).filter(v => interviewerKeys.indexOf(v[0]) !== -1)
    form.setFieldValue('interviewer', interviewerValues)
    form.setFieldValue('interviewee', intervieweeValues)
  }, [feedbackQuestions])

  return (
    <Card className="w-10 m-3 feedback-details">
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
              <Checkbox.Group options={interviewerOptions} onChange={onChangeInterviewer} />
            </Form.Item>
          </Col>
          <Col span={12}>
            As an interviewee, what would you like to receive feedback about? 
            <Form.Item name="interviewee">
              <Checkbox.Group options={intervieweeOptions} onChange={onChangeInterviewee} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default FeedbackQuestions
