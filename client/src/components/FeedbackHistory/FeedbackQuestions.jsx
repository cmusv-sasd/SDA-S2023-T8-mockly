// eslint-disable-next-line no-unused-vars
import { Card, Modal, Slider, Input, Form, Button, Space, Checkbox, Row, Col } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import {
  // eslint-disable-next-line no-unused-vars
  setFeedbackQuestions,addQuestions
} from '../../store/feedbackQuestionsSlice'
import { userSelector } from '../../store/userSlice'
// eslint-disable-next-line no-unused-vars
import { feedbackQuestionsSelector } from '../../store/feedbackQuestionsSlice'
// eslint-disable-next-line no-unused-vars
import { fetchFeedbackQuestions, updateFeedbackQuestions,createFeedbackQuestions } from '../../api/feedback'
// eslint-disable-next-line no-unused-vars
const { TextArea } = Input

/*


This file is the top part of the FeedbackHistory page where users can select what
type of feedback they would like to receive


*/

// eslint-disable-next-line no-unused-vars
const FeedbackQuestions = () => {
  // eslint-disable-next-line no-unused-vars
  const feedbackQuestions = useSelector(feedbackQuestionsSelector)
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const user = useSelector(userSelector)
  // eslint-disable-next-line no-unused-vars
  const [checkedInterviewer, setCheckedInterviewer] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [checkedInterviewee, setCheckedInterviewee] = useState([])

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

  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const onChangeInterviewer = async (checkedValues) => {
    console.log("checked = ", checkedValues);
   
    const res = await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {questions:checkedValues, isInterviewer:true})
    console.log(res)
    await dispatch(addQuestions({questionsInterviewer: res.questionsInterviewer}))
  };

  const onChangeInterviewee = async (checkedValues) => {
    console.log("checked = ", checkedValues);
    const res = await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {questions:checkedValues, isInterviewer:false})
    await dispatch(addQuestions({questionsInterviewee: res.questionsInterviewee}))
  };

  
  //
  useEffect(() => {
    const getFeedback = async () => {
      try {
        let res = await fetchFeedbackQuestions(user.firstName + ' ' + user.lastName)
        console.log("res", res)
        console.log("name is ", user.firstName + ' ' + user.lastName)
        if(res === null || res.length <= 0){
          console.log("creating FQ")
          await createFeedbackQuestions(user.firstName + ' ' + user.lastName)
          //  await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {isInterviewer: false, questions:{}})
          //  await updateFeedbackQuestions(user.firstName + ' ' + user.lastName, {isInterviewer: true, questions:{}})
          res = await fetchFeedbackQuestions(user.firstName + ' ' + user.lastName)
        }
        console.log("res updated", res)
        dispatch(setFeedbackQuestions(res))
      } catch (error) {
        console.error(error)
      }
    }
    getFeedback()
  }, [dispatch])
  return (
    <Card className="w-10 m-3" >
      <Form name="questionsForm"        
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout="horizontal"
      >
        <Row>
          {/*
                      <Col  span={12}>
            
            <Checkbox.Group onChange={onChangeInterviewer} style={{display: "inline-flex", flexDirection: "column", margin:4}}>Interviewer: 
              <Form.Item style = {{margin:0}} name={`interviewer-language`} key={`interviewer-language-item`}label="Language" >
                <Checkbox></Checkbox>
              </Form.Item>
              <Form.Item style = {{margin:0}} label="Professionalism" name={`interviewer-professionalism`} key={`interviewer-professionalism-item`}>
                <Checkbox></Checkbox>
              </Form.Item>
              <Form.Item style = {{margin:0}} label="Technical" name={`interviewer-technical`} key={`interviewer-technical-item`}>
                <Checkbox></Checkbox>
              </Form.Item>
            </Checkbox.Group>
          </Col>
          <Col span={12}>
            <Checkbox.Group onChange={onChangeInterviewee} style={{display: "inline-flex", flexDirection: "column", margin:4}}>Interviewee: 
              <Form.Item style = {{margin:0}} name={`interviewee-language`} key={`interviewee-language-item`}label="Language" >
                <Checkbox></Checkbox>
              </Form.Item>
              <Form.Item style = {{margin:0}} label="Professionalism" name={`interviewee-professionalism`} key={`interviewee-professionalism-item`}>
                <Checkbox></Checkbox>
              </Form.Item>
              <Form.Item style = {{margin:0}} label="Technical" name={`interviewee-technical`} key={`interviewee-technical-item`}>
                <Checkbox></Checkbox>
              </Form.Item>
            </Checkbox.Group>
          </Col>
            */}
          <Col  span={12}>
            Interviewer: 
            <Checkbox.Group options={interviewerOptions} onChange={onChangeInterviewer} style={{display: "inline-flex", flexDirection: "column", margin:4}} />
          </Col>
          <Col span={12}>
            Interviewee: 
            <Checkbox.Group options={intervieweeOptions} onChange={onChangeInterviewee} style={{display: "inline-flex", flexDirection: "column", margin:4}} />

          </Col>
        </Row>
        

        
      
        
        


      </Form>
    </Card>
  )
}

export default FeedbackQuestions
