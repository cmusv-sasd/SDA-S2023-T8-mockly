import { Modal, Slider, Input, Form, Button, Space } from 'antd'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/*
import {
  setFeedbackQuestions,
  feedbackSelector,
} from '../../store/feedbackSlice'
*/
import { createFeedback } from '../../api/feedback'
import { userSelector } from '../../store/userSlice'
// eslint-disable-next-line no-unused-vars
import { feedbackQuestionsSelector } from '../../store/feedbackQuestionsSlice'
// eslint-disable-next-line no-unused-vars
import { fetchFeedbackQuestions } from '../../api/feedback'
import {
  // eslint-disable-next-line no-unused-vars
  setFeedbackQuestions
} from '../../store/feedbackQuestionsSlice'
/*


This file is the Modal that people use to SEND feedback to the recepient.


*/
// eslint-disable-next-line no-unused-vars
const { TextArea } = Input
// eslint-disable-next-line no-unused-vars
const FeedbackFormModal = ({
  open,
  setOpen,
  time,
  currRecipient,
  isInterviewer
}) => {
  /*
  Selectors and states
  */
  //  const feedback = useSelector(feedbackSelector)
  //  const feedbackQuestions = useSelector(feedbackQuestionsSelector)
  // eslint-disable-next-line no-unused-vars
  const user = useSelector(userSelector)
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const [currQuestions, setCurrQuestions] = useState({})

  const onFinish = async (values) => {
    //  console.log('Success:', values)
    //  save to MongoDB
    try {
      //const questions = { questions: values }
      //  console.log('in onFinish', currRecipient)
      setOpen(false)
      await createFeedback({
        questions: currQuestions, // feedback.questions,
        answers: values,
        reviewer: `${user.firstName} ${user.lastName}`,
        time,
        reviewee: currRecipient,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const validateMessages = {
    required: "Please fill this out!",
  };

  //
  useEffect(() => {
    const getFeedback = async () => {
      try {
        /*
        const response = await fetchUserAPI()
        
        console.log('Profile Page', response)
        */
        //  this will be replaced with fetching the questions
        //  This uses dummy data for now
        // eslint-disable-next-line no-unused-vars
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
        console.log("CURR RECIPIENT IS: ", currRecipient)
        let res = await fetchFeedbackQuestions(currRecipient)
        console.log("RES BEFORE: ",res)
        //  console.log('done')
        //  dispatch(setFeedbackQuestions(response))
        //  If the recipient is not an interiviewer, then they want to have the interviewee questions
        if(res){
          res = isInterviewer ? res.questionsInterviewer : res.questionsInterviewee
          console.log("RES: ",res)
          setCurrQuestions(res)
        }
        
        /*
        if(res !== null){
          dispatch(setFeedbackQuestions(res))
        }
        */
        
        
        
      } catch (error) {
        console.error(error)
      }
    }
    getFeedback()
  }, [dispatch, currRecipient])
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={1000}
      footer={[<Space key="feedback-space" direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
          <Button type='primary' htmlType='submit' form="feedbackForm" key="submit-feedback">
            Submit
          </Button>
        </Space>]}
    >
      Recipient: {`${currRecipient}`}
      <Form
        name='feedbackForm'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout='vertical'
        validateMessages={validateMessages}
      >
        {open &&
          currQuestions &&
          Object.keys(currQuestions).map((key) => {
            const currQuestion = currQuestions[key]
            //  console.log(currQuestion)
            const questionType = currQuestion.type
            switch (questionType) {
              case 'text':
                return (
                  <Form.Item
                    label={currQuestion.question}
                    name={`${key}`}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    key={`question-${key}-item`}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                )
                //  eslint-disable-next-line no-unreachable
                break
              case '1-5':
                return (
                  <Form.Item
                    label={currQuestion.question}
                    name={`${key}`}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    key={`question-${key}-item`}
                    initialValue={3}
                  >
                    <Slider
                      step={1}
                      min={0} max={5}
                      marks={{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }}
                      tooltip={{open:false}}
                      
                    />
                  </Form.Item>
                )
                //  eslint-disable-next-line no-unreachable
                break
              default:
                //  eslint-disable-next-line no-unreachable
                break
            }
          })}
      </Form>
    </Modal>
  )
}

export default FeedbackFormModal
