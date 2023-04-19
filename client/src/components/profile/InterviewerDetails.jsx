import { useDispatch } from 'react-redux'
import { Card, Tag, Button, Form, Select, Typography, DatePicker } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUserInterviewerDetails } from '../../store/userSelector'
import { setInterviewerDetails } from '../../store/userSlice'
import { updateInterviewerDetailsAPI } from '../../api/userProfile'
import { find } from 'lodash'
import dayjs from 'dayjs'
import '../../styles/profile/interviewerDetails.css'

const { Paragraph } = Typography
const { Option } = Select

const InterviewerDetailsCard = () => {
  const dispatch = useDispatch()
  const [form] = useForm()

  const INTERVIEWER_TYPES = [
    { value: 'peer', text: 'Peer' },
    { value: 'expert', text: 'Expert' },
  ]

  const FIELD_OPTIONS = [
    {
      value: 'DATA_STRUCTURES_ALGORITHMS',
      text: 'Data Structures and Algorithms',
    },
    { value: 'SYSTEM_DESIGN', text: 'System Design' },
    { value: 'DATA_SCIENCE', text: 'Data Science' },
    { value: 'FRONTEND', text: 'Frontend' },
    { value: 'BACKEND', text: 'Backend' },
    { value: 'BEHAVIORAL', text: 'Behavioral' },
  ]

  // set editMode to true for edit card mode else false for display mode
  const [editMode, setEditMode] = useState(false)
  // set loading to true to see loading spinner else false to hide the spinner
  const [loading, setLoading] = useState(false)

  // Retrieve the user's interviewer details from the Redux store
  const interviewer = useSelector(getUserInterviewerDetails).interviewerDetails
  // local state for timeSlots to show tags as the date time is selected
  const [timeSlots, setTimeSlots] = useState([])

  useEffect(() => {
    initiateValues()
  }, [interviewer, form])

  const initiateValues = () => {
    setTimeSlots(
      interviewer.time.map((time) => dayjs.unix(time).format('MM/DD/YY h A'))
    )
    form.setFieldsValue({
      type: interviewer.type,
      fields: interviewer.fields,
    })
  }

  // toggles edit mode value on edit icon click and reset the forms state back to original state
  const handleEditClick = () => {
    setEditMode((prevEditMode) => !prevEditMode)
    initiateValues()
  }

  // Add a time slot to the list of time slots
  const handleAddTimeSlot = (dateTime) => {
    form.setFieldValue('timeSlots', '')
    const formattedTime = dateTime.format('MM/DD/YY h A')
    const newTimeSlots =
      timeSlots.indexOf(formattedTime) === -1
        ? [...timeSlots, dateTime.format('MM/DD/YY h A')]
        : [...timeSlots]
    setTimeSlots(newTimeSlots)
  }

  // Remove a time slot from the list of time slots
  const handleRemoveTimeSlot = (idx) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== idx))
  }

  const handleSaveClick = async () => {
    setLoading(true)
    const userId = localStorage.getItem('id')
    try {
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      const formData = {
        ...formValues,
        time: timeSlots.map((slot) => dayjs(slot, 'MM/DD/YY h A').unix()),
      }
      // Make an API call to update the user's interviewer details
      const res = await updateInterviewerDetailsAPI(userId, { ...formData })
      // if API call is successful, dispatch the setInterviewerDetails action to update the Redux store
      if (!res.status) {
        dispatch(setInterviewerDetails(formData))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setEditMode(false)
  }

  // Function to handle cancel button click
  // resets form field values and sets edit mode to false
  const handleCancelClick = () => {
    initiateValues()
    setEditMode(false)
  }

  // render tags for the list of fields
  const renderFields = (fields) => {
    return fields.map((field) => {
      const fieldObj = find(FIELD_OPTIONS, { value: field })
      return (
        <Tag className='user-profile-interviewer--tag' key={fieldObj.value}>
          {fieldObj.text}
        </Tag>
      )
    })
  }

  // render tags for the list of time slots
  const renderTimeSlots = (timeSlots, isClosable) => {
    return timeSlots.map((slot, index) => (
      <Tag
        className='user-profile-interviewer--tag'
        closable={isClosable}
        key={`${slot}-${index}`}
        onClose={isClosable ? () => handleRemoveTimeSlot(index) : null}
      >
        {slot}
      </Tag>
    ))
  }

  // Render the Interviewer Details Card
  return (
    <Card
      className='user-profile-card interviewer-details'
      title='Interviewer Details'
      loading={loading}
      extra={
        <Button type='text' onClick={handleEditClick}>
          <EditOutlined />
        </Button>
      }
    >
      {editMode ? (
        <Form form={form} layout='vertical' onFinish={handleSaveClick}>
          <Form.Item
            label='Interviewer Type'
            name='type'
            rules={[
              { required: true, message: 'Interviewer type cannot be empty' },
            ]}
          >
            <Select>
              {INTERVIEWER_TYPES.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='Fields'
            name='fields'
            rules={[{ required: true, message: 'Fields cannot be empty' }]}
          >
            <Select mode='multiple' allowClear>
              {FIELD_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='Date/Time'
            name='timeSlots'
            style={{ marginBottom: '12px' }}
          >
            <DatePicker
              showTime={{ use12Hours: true }}
              format='MM/DD/YY h A'
              onOk={handleAddTimeSlot}
              disabledDate={(current) => {
                const inPast = current && current < dayjs().endOf('day')
                const afterThreeWeeks =
                  current &&
                  current &&
                  current > dayjs().endOf('day').add(3, 'week')
                return inPast || afterThreeWeeks
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <div>{renderTimeSlots(timeSlots, true)}</div>
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
                htmlType='submit'
              >
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      ) : (
        <>
          <Paragraph className='user-profile-interviewer--field-name'>
            <strong>Interviewer Type: </strong>
            {interviewer.type
              ? find(INTERVIEWER_TYPES, { value: interviewer.type }).text
              : ''}
          </Paragraph>
          <Paragraph className='user-profile-interviewer--field-name'>
            <strong>Fields:</strong>
          </Paragraph>
          {renderFields(interviewer.fields)}
          <Paragraph className='user-profile-interviewer--field-name'>
            <strong>My Availability: </strong>
          </Paragraph>
          {renderTimeSlots(timeSlots, false)}
        </>
      )}
    </Card>
  )
}

export default InterviewerDetailsCard
