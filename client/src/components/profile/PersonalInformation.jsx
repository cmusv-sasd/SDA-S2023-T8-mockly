import { useState } from 'react'
import { map } from 'lodash'

import { Card, Button, Form, Input, Typography, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setPersonalInformation } from '../../store/userSlice'
import { getUserPersonalInformation } from '../../store/userSelector'
import { updatePersonalInformationAPI } from '../../api/userProfile'

const { Paragraph } = Typography
const { Option } = Select

const PersonalInformationCard = () => {
  const pronounsOptions = {
    '': 'Select Pronoun',
    he: 'He/Him',
    she: 'She/Her',
    they: 'They/Them',
  }

  const genderOptions = {
    '': 'Select Gender',
    male: 'Male',
    female: 'Female',
    nonbinary: 'Non-binary',
  }

  const ethnicityOptions = {
    '': 'Select Ethnicity',
    asian: 'Asian',
    black: 'Black',
    hispanic_latino: 'Hispanic or Latino',
    native_american_alaska_native: 'Native American or Alaska Native',
    white: 'White',
    other: 'Other',
  }

  const dispatch = useDispatch()
  const [form] = useForm()

  // set editMode to true for edit card mode else false for display mode
  const [editMode, setEditMode] = useState(false)
  // set loading to true to see loading spinner else false to hide the spinner
  const [loading, setLoading] = useState(false)

  // Retrieve the user's personal information from the Redux store
  const user = useSelector(getUserPersonalInformation)

  const initiateValues = () => {
    form.setFieldsValue({
      email: user.email,
      phoneNumber: user.phoneNumber,
      pronouns: user.pronouns,
      gender: user.gender,
      ethnicity: user.ethnicity,
    })
  }

  // toggles edit mode value on edit icon click and reset the forms state back to original state
  const handleEditClick = () => {
    initiateValues()
    setEditMode((prevEditMode) => !prevEditMode)
  }

  // dispatches action to save personal information and sets edit mode to false
  const handleSaveClick = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('id')
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      // Make an API call to update the user's personal information
      const res = await updatePersonalInformationAPI(userId, { ...formValues })
      // if API call is successful, dispatch the setPersonalInformation action to update the Redux store
      if (!res.status) {
        dispatch(setPersonalInformation(formValues))
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

  // Render the PersonalInformation Card
  return (
    <Card
      className='user-profile-card'
      title='Personal Information'
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
            label='Email'
            name='email'
            rules={[
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
              {
                required: true,
                message: 'Email is required',
              },
            ]}
            hasFeedback
          >
            <Input name='email' />
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            label='Phone Number'
            rules={[
              {
                required: true,
                message: 'Phone number is required',
              },
              {
                pattern: /^\d{10}$/,
                message: 'Please enter a valid 10-digit phone number',
              },
            ]}
            hasFeedback
          >
            <Input name='phoneNumber' />
          </Form.Item>
          <Form.Item name='pronouns' label='Pronouns'>
            <Select>
              {map(pronounsOptions, (label, value) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='gender' label='Gender'>
            <Select>
              {map(genderOptions, (label, value) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='ethnicity' label='Ethnicity'>
            <Select placeholder='Select ethnicity' style={{ width: '100%' }}>
              {map(ethnicityOptions, (label, value) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className='user-card--button-container'>
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
          <Paragraph>
            <strong>Email Address:</strong> {user.email}
          </Paragraph>
          <Paragraph>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </Paragraph>
          <Paragraph>
            <strong>Pronouns:</strong>{' '}
            {user.pronouns === '' ? '' : pronounsOptions[user.pronouns]}
          </Paragraph>
          <Paragraph>
            <strong>Gender:</strong>{' '}
            {user.gender === '' ? '' : genderOptions[user.gender]}
          </Paragraph>
          <Paragraph>
            <strong>Ethnicity:</strong>{' '}
            {user.ethnicity === '' ? '' : ethnicityOptions[user.ethnicity]}
          </Paragraph>
        </>
      )}
    </Card>
  )
}

export default PersonalInformationCard
