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
  isInterviewer,
  isUpdated,
  setIsUpdated
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
        isInterviewer,
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
          setIsUpdated(false)
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
  }, [dispatch, currRecipient, isUpdated])
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
