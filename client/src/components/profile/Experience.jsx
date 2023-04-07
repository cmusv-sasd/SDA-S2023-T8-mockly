import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  List,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { getUserExperience } from '../../store/userSelector'
import {
  addExperience,
  removeExperience,
  updateExperience,
} from '../../store/userSlice'
import {
  addExperienceDetailsAPI,
  updateExperienceDetailsAPI,
  deleteExperienceDetailsAPI,
} from '../../api/userProfile'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography
const { Item } = List

const ExperienceCard = () => {
  // initial state of the form when adding new experience details
  const initialFormState = {
    companyName: '',
    position: '',
    startDate: null,
    endDate: null,
    location: '',
    description: '',
  }

  const dispatch = useDispatch()
  const [form] = useForm()

  // Retrieve the user's experience details list from the Redux store
  const userExperienceList = useSelector(getUserExperience)

  // set addExperienceMode to true to display a form for adding new experience details
  const [addExperienceMode, setAddExperienceMode] = useState(false)
  // set loading to true to see loading spinner else false to hide the spinner
  const [loading, setLoading] = useState(false)
  // set the experience details object that is to be edited
  const [selectedExperience, setSelectedExperience] = useState(null)

  // useEffect to initiate form values when the selectedExperience state changes
  useEffect(() => {
    if (selectedExperience) {
      initiateValues(selectedExperience)
    }
  }, [selectedExperience, form])

  // Set the initial form values depending on whether an experience entry is being edited or not
  const initiateValues = (experience) => {
    // if experience is defined then we are updating existing experience details
    // else adding new experience details
    if (experience) {
      // Convert the startDate and endDate from Unix timestamps to Day.js objects
      const startDate = dayjs.unix(experience.startDate)
      const endDate = experience.endDate ? dayjs.unix(experience.endDate) : null

      form.setFieldsValue({ ...experience, startDate, endDate })
    } else {
      form.setFieldsValue(initialFormState)
    }
  }

  // Handle the click event for adding new experience
  const handleAddExperienceClick = () => {
    initiateValues()
    setAddExperienceMode((prevMode) => !prevMode)
    setSelectedExperience(null)
  }

  // Handle adding new experience to the user's experience list
  const handleAddNewExperience = async () => {
    setLoading(true)
    const userId = localStorage.getItem('id')
    try {
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      // Convert the startDate and endDate to Unix timestamps
      const startDate = dayjs(formValues.startDate).unix()
      const endDate = dayjs(formValues.endDate).unix()
      const formData = {
        ...formValues,
        startDate,
        endDate,
      }
      // Make an API call to add new experience to user's experience list
      const res = await addExperienceDetailsAPI(userId, { ...formData })
      console.log('Experience Details added: ', res)
      // if API call is successful, dispatch the addExperience action to update the Redux store
      if (!res.status) {
        dispatch(addExperience(res))
      }
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
    setAddExperienceMode(false)
  }

  // Handle the cancel button click event in the add experience form
  const handleCancelAddExperience = () => {
    initiateValues()
    setAddExperienceMode(false)
  }

  // Handle deleting an experience entry from the user's experience list
  const deleteExperienceDetails = async (experienceId) => {
    const userId = localStorage.getItem('id')
    try {
      // Make an API call to delete experience from user's experience list
      const res = await deleteExperienceDetailsAPI(userId, { experienceId })
      console.log('Experience Details delete: ', res)
      // if API call is successful, dispatch the removeExperience action to update the Redux store
      if (!res.status) {
        dispatch(removeExperience(experienceId))
      }
    } catch (e) {
      console.log(e)
    }
  }

  // Handle the click event for editing an experience entry
  const handleEditExperienceClick = (experience) => {
    setSelectedExperience(experience)
    setAddExperienceMode(false)
  }

  // Handle updating an existing experience entry in the user's experience list
  const handleEditExperience = async () => {
    setLoading(true)
    const userId = localStorage.getItem('id')
    try {
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      const startDate = dayjs(formValues.startDate).unix()
      const endDate = formValues.endDate
        ? dayjs(formValues.endDate).unix()
        : null
      const formData = {
        ...formValues,
        experienceId: selectedExperience._id,
        startDate,
        endDate,
      }
      // Make an API call to add new experience to user's experience list
      const res = await updateExperienceDetailsAPI(userId, { ...formData })
      console.log('Experience Details updated: ', res)
      // if API call is successful, dispatch the updateExperience action to update the Redux store
      if (!res.status) {
        dispatch(updateExperience(res))
      }
    } catch (e) {
      console.log(e)
    }
    setSelectedExperience(null)
    setLoading(false)
  }

  const handleCancelEditExperience = () => {
    initiateValues()
    setSelectedExperience(null)
  }

  // Function to render the user's experience list
  const renderExperienceList = () => {
    if (userExperienceList.experience.length === 0) {
      return <Paragraph>No work experience available.</Paragraph>
    }

    return (
      <List
        itemLayout='vertical'
        dataSource={userExperienceList.experience}
        renderItem={(experience) => {
          // if an entry is selected for editing then display edit form for that entry
          // else display the entry as a list item
          if (selectedExperience && selectedExperience._id === experience._id) {
            return renderExperienceForm()
          } else {
            const startDate = dayjs
              .unix(experience.startDate)
              .format('MMM YYYY')
            const endDate = experience.endDate
              ? dayjs.unix(experience.endDate).format('MMM YYYY')
              : null
            return (
              <Item>
                <Title level={3} style={{ marginBottom: '5px' }}>
                  {experience.companyName}
                </Title>
                <Title level={4} style={{ marginTop: '5px' }}>
                  {experience.position}
                </Title>
                <Paragraph>
                  {startDate} - {endDate || 'Current'}
                </Paragraph>
                <Paragraph>{experience.location}</Paragraph>
                <Paragraph style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                  {experience.description}
                </Paragraph>
                <Button
                  danger
                  onClick={() => deleteExperienceDetails(experience._id)}
                >
                  <DeleteOutlined />
                </Button>
                <Button
                  type='primary'
                  ghost
                  onClick={() => handleEditExperienceClick(experience)}
                >
                  <EditOutlined />
                </Button>
              </Item>
            )
          }
        }}
      />
    )
  }
  // Function to render the experience form used for adding or editing experience entries
  const renderExperienceForm = () => {
    return (
      <Form
        layout='vertical'
        onFinish={
          selectedExperience ? handleEditExperience : handleAddNewExperience
        }
        form={form}
      >
        <Form.Item
          label='Company Name'
          name='companyName'
          rules={[{ required: true, message: 'Please input the company name' }]}
        >
          <Input name='companyName' />
        </Form.Item>
        <Form.Item
          label='Position'
          name='position'
          rules={[{ required: true, message: 'Please input the position' }]}
        >
          <Input name='position' />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Start Date'
              name='startDate'
              rules={[
                { required: true, message: 'Please input the startDate' },
              ]}
            >
              <DatePicker
                name='startDate'
                picker='month'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='End Date' name='endDate'>
              <DatePicker
                name='endDate'
                picker='month'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Location' name='location'>
          <Input name='location' />
        </Form.Item>
        <Form.Item label='Description' name='description'>
          <Input.TextArea name='description' rows={4} />
        </Form.Item>
        <Form.Item>
          <div className='user-right-card--button-container'>
            <Button
              className='user-right-card--cancel-btn'
              type='default'
              shape='round'
              onClick={
                selectedExperience
                  ? handleCancelEditExperience
                  : handleCancelAddExperience
              }
            >
              Cancel
            </Button>
            <Button
              className='user-right-card--save-btn'
              type='primary'
              shape='round'
              htmlType='submit'
              loading={loading}
            >
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }

  return (
    <Card
      className='user-profile-card'
      title='Experience'
      extra={
        <Button type='text' onClick={handleAddExperienceClick}>
          <PlusOutlined />
        </Button>
      }
    >
      {renderExperienceList()}
      {addExperienceMode && renderExperienceForm()}
    </Card>
  )
}

export default ExperienceCard
