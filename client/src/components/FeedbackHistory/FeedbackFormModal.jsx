import { Modal, Slider, Input, Form, Button } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFeedbackQuestions,
  feedbackSelector,
} from '../../store/feedbackSlice'
import { createFeedback } from '../../api/feedback'
import { userSelector } from '../../store/userSlice'
// eslint-disable-next-line no-unused-vars
const { TextArea } = Input
// eslint-disable-next-line no-unused-vars
const FeedbackFormModal = ({
  open,
  setOpen,
  // eslint-disable-next-line no-unused-vars
  selectedFeedbackForm,
  time,
  interviewer,
}) => {
  const feedback = useSelector(feedbackSelector)
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const user = useSelector(userSelector)
  //
  // eslint-disable-next-line no-unused-vars
  /*
  const handleConfirm = async (idx) => {
    try {
      const {
        interviewer: interviewerType,
        field,
        difficulty,
      } = form.getFieldsValue()
      const match = {
        ...matches[idx],
        interviewerType,
        field,
        difficulty,
        interviewee: user._id,
      }
      const res = await createInterview(match)
      messageApi.open({
        type: 'success',
        content: 'Successfully booked your interview!',
      })
      dispatch(addInterview(res))
      setOpen(false)
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Failed to request matches.' })
    }
  }
  */

  const onFinish = async (values) => {
    console.log('Success:', values)
    //  save to MongoDB
    try {
      //const questions = { questions: values }
      console.log('in onFinish', interviewer)
      await createFeedback({
        questions: feedback.questions,
        answers: values,
        reviewer: `${user.firstName} ${user.lastName}`,
        time,
        reviewee: interviewer,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

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
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={1000}
      footer={null}
    >
      <Form
        name='feedbackForm'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout='vertical'
      >
        {open &&
          feedback &&
          Object.keys(feedback.questions).map((key) => {
            const currQuestion = feedback.questions[key]
            console.log(currQuestion)
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
                  >
                    <Slider
                      step={20}
                      marks={{ 0: 0, 20: 1, 40: 2, 60: 3, 80: 4, 100: 5 }}
                      initialValues={60}
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FeedbackFormModal
