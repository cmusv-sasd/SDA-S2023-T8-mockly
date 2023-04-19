import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Typography,
  List,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
  addEducation,
  removeEducation,
  updateEducation,
} from '../../store/userSlice'
import { getUserEducation } from '../../store/userSelector'
import { useDispatch, useSelector } from 'react-redux'
import {
  addEducationDetailsAPI,
  deleteEducationDetailsAPI,
  updateEducationDetailsAPI,
} from '../../api/userProfile'
import { find } from 'lodash'
import dayjs from 'dayjs'
import '../../styles/profile/detailsList.css'

const { Paragraph } = Typography
const { Option } = Select

const EducationCard = () => {
  // initial state of the form when adding new education details
  const initialFormState = {
    schoolName: '',
    educationLevel: '',
    startDate: null,
    endDate: null,
    major: '',
    minor: '',
    gpa: '',
  }

  const EDUCATION_LEVEL = [
    { value: 'highSchool', text: 'High School' },
    { value: 'associateDegree', text: 'Associates Degree' },
    { value: 'bachelorsDegree', text: 'Bachelors Degree' },
    { value: 'mastersDegree', text: 'Masters Degree' },
  ]

  // set addEducationMode to true to display a form for adding new education details
  const [addEducationMode, setAddEducationMode] = useState(false)
  // set loading to true to see loading spinner else false to hide the spinner
  const [loading, setLoading] = useState(false)
  // set the education details that is to be edited
  const [selectedEducation, setSelectedEducation] = useState(null)

  const dispatch = useDispatch()
  const [form] = useForm()

  // Retrieve the user's education details list from the Redux store
  const userEducationList = useSelector(getUserEducation)

  // useEffect to initiate form values when the selectedEducation state changes
  // avoid error caused by updating parent component's state (educationList) by the child component(educationForm)
  useEffect(() => {
    if (selectedEducation) {
      initiateValues(selectedEducation)
    }
  }, [selectedEducation, form])

  // Set the initial form values depending on whether an education entry is being edited or not
  const initiateValues = (education) => {
    // if education is defined then we are updating existing education details
    // else adding new education details
    if (education) {
      // Convert the startDate and endDate from Unix timestamps to Day.js objects
      const startDate = dayjs.unix(education.startDate)
      const endDate = education.endDate ? dayjs.unix(education.endDate) : null

      form.setFieldsValue({ ...education, startDate, endDate })
    } else {
      form.setFieldsValue(initialFormState)
    }
  }

  // Handle the click event for adding new education
  const handleAddEducationClick = () => {
    initiateValues()
    setAddEducationMode((prevAddMode) => !prevAddMode)
    setSelectedEducation(null)
  }

  // Handle adding new education to the user's education list
  const handleAddNewEducation = async () => {
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
      // Make an API call to add new education to user's education list
      const res = await addEducationDetailsAPI(userId, { ...formData })
      // if API call is successful, dispatch the addEducation action to update the Redux store
      if (!res.status) {
        dispatch(addEducation(res))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setAddEducationMode(false)
  }

  // Handle the cancel button click event in the add education form
  const handleCancelAddEducation = () => {
    initiateValues()
    setAddEducationMode(false)
  }

  // Handle deleting an education entry from the user's education list
  const deleteEducationDetails = async (educationId) => {
    const userId = localStorage.getItem('id')
    try {
      // Make an API call to delete education from user's education list
      const res = await deleteEducationDetailsAPI(userId, { educationId })
      // if API call is successful, dispatch the removeEducation action to update the Redux store
      if (!res.status) {
        dispatch(removeEducation(educationId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Handle the click event for editing an education entry
  const handleEditEducationClick = (education) => {
    setSelectedEducation(education)
    setAddEducationMode(false)
  }

  // Handle updating an existing education entry in the user's education list
  const handleEditEducation = async () => {
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
        educationId: selectedEducation._id,
        startDate,
        endDate,
      }
      // Make an API call to add new education to user's education list
      const res = await updateEducationDetailsAPI(userId, { ...formData })
      // if API call is successful, dispatch the updateEducation action to update the Redux store
      if (!res.status) {
        dispatch(updateEducation(res))
      }
    } catch (e) {
      console.error(e)
    }
    setSelectedEducation(null)
    setLoading(false)
  }

  const handleCancelEditEducation = () => {
    initiateValues()
    setSelectedEducation(null)
  }

  // Function to render the user's education list
  const renderEducationList = () => {
    if (userEducationList.education.length === 0) {
      return <Paragraph>No education information available.</Paragraph>
    }

    return (
      <List
        itemLayout='vertical'
        dataSource={userEducationList.education}
        renderItem={(education) => {
          // if an entry is selected for editing then display edit form for that entry
          // else display the entry as a list item
          if (selectedEducation && selectedEducation._id === education._id) {
            return renderEducationForm()
          } else {
            const startDate = dayjs.unix(education.startDate).format('MMM YYYY')
            const endDate = education.endDate
              ? dayjs.unix(education.endDate).format('MMM YYYY')
              : null
            const educationLevelObj = find(EDUCATION_LEVEL, {
              value: education.educationLevel,
            })

            return (
              <List.Item>
                <Paragraph className='user-details-list--header'>
                  {education.schoolName}
                </Paragraph>
                <Paragraph className='user-details-list--subheader'>
                  {educationLevelObj.text}
                </Paragraph>
                <Paragraph className='user-details-list--date'>
                  {startDate} - {endDate || 'Current'}
                </Paragraph>
                <Paragraph className='user-details-list--content'>
                  <strong>Major in: </strong>
                  {education.major}
                </Paragraph>
                {education.minor && (
                  <Paragraph className='user-details-list--content'>
                    <strong>Minor in: </strong> {education.minor}
                  </Paragraph>
                )}
                {education.gpa && (
                  <Paragraph className='user-details-list--content'>
                    <strong>GPA: </strong>
                    {education.gpa}
                  </Paragraph>
                )}
                <Button
                  className='user-details-list--actions'
                  danger
                  onClick={() => deleteEducationDetails(education._id)}
                >
                  <DeleteOutlined />
                </Button>
                <Button
                  className='user-details-list--actions'
                  type='primary'
                  ghost
                  onClick={() => handleEditEducationClick(education)}
                >
                  <EditOutlined />
                </Button>
              </List.Item>
            )
          }
        }}
      />
    )
  }

  // Function to render the education form used for adding or editing education entries
  const renderEducationForm = () => {
    return (
      <Form
        layout='vertical'
        className='user-details-list--form'
        onFinish={
          selectedEducation ? handleEditEducation : handleAddNewEducation
        }
        form={form}
      >
        <Paragraph className='user-details-list--form-header'>
          {selectedEducation ? 'Edit details' : 'Add new details'}
        </Paragraph>
        <Form.Item
          label='School Name'
          name='schoolName'
          rules={[{ required: true, message: 'Please input the school name' }]}
        >
          <Input name='schoolName' />
        </Form.Item>
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item
              label='Education Level'
              name='educationLevel'
              rules={[
                {
                  required: true,
                  message: 'Please select the education level',
                },
              ]}
            >
              <Select>
                {EDUCATION_LEVEL.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='GPA' name='gpa'>
              <Input name='gpa' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Start Date'
              name='startDate'
              rules={[
                { required: true, message: 'Please select the start date' },
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Major'
              name='major'
              rules={[{ required: true, message: 'Please input the major' }]}
            >
              <Input name='major' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Minor' name='minor'>
              <Input name='minor' />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className='user-right-card--button-container'>
            <Button
              className='user-right-card--cancel-btn'
              type='default'
              shape='round'
              onClick={
                selectedEducation
                  ? handleCancelEditEducation
                  : handleCancelAddEducation
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
      title='Education'
      extra={
        <Button type='text' onClick={handleAddEducationClick}>
          <PlusOutlined />
        </Button>
      }
    >
      {addEducationMode && renderEducationForm()}
      {renderEducationList()}
    </Card>
  )
}

export default EducationCard
