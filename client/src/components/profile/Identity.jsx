import React, { useState } from 'react'
import { Card, Typography, Form, Input, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUserIdentity } from '../../store/userSelector'
import { setIdentity } from '../../store/userSlice'
import { updatePersonalIdentityAPI } from '../../api/userProfile'
import '../../styles/profile/identity.css'

const { Paragraph } = Typography

const IdentityCard = () => {
  const dispatch = useDispatch()
  const [form] = useForm()

  // set editMode to true for edit card mode else false for display mode
  const [editMode, setEditMode] = useState(false)
  // set loading to true to see loading spinner else false to hide the spinner
  const [loading, setLoading] = useState(false)

  // Retrieve the user's identity information from the Redux store
  const userIdentity = useSelector(getUserIdentity)

  // Function to initialize form values with the user's current identity information
  const initiateValues = () => {
    form.setFieldsValue({
      firstName: userIdentity.firstName,
      lastName: userIdentity.lastName,
      organization: userIdentity.organization,
      position: userIdentity.position,
    })
  }

  // Function to handle edit button click
  const handleEditClick = () => {
    initiateValues()
    setEditMode((prevEditMode) => !prevEditMode)
  }

  // Function to handle save button click
  const handleSaveClick = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('id')
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      // Make an API call to update the user's personal identity
      const res = await updatePersonalIdentityAPI(userId, { ...formValues })
      console.log('Personal Identity updated: ', res)
      // if API call is successful, dispatch the setIdentity action to update the Redux store
      if (!res.status) {
        dispatch(setIdentity(formValues))
      }
    } catch (e) {
      console.log(e)
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

  // Render the IdentityCard component
  return (
    <Card
      className='user-profile-card'
      title='Identity'
      loading={loading}
      extra={
        <Button type='text' onClick={handleEditClick}>
          <EditOutlined />
        </Button>
      }
    >
      {editMode ? (
        <>
          <Form form={form} layout='vertical' onFinish={handleSaveClick}>
            <Form.Item
              name='firstName'
              label='First Name'
              rules={[
                {
                  required: true,
                  message: 'First name is required',
                },
              ]}
              hasFeedback
            >
              <Input name='firstName' />
            </Form.Item>
            <Form.Item name='lastName' label='Last Name'>
              <Input name='lastName' />
            </Form.Item>
            <Form.Item name='position' label='Position/Degree Name'>
              <Input name='position' />
            </Form.Item>
            <Form.Item name='organization' label='Organization'>
              <Input name='organization' />
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
        </>
      ) : (
        <>
          <Paragraph className='user-identity--fullname'>
            {`${userIdentity.firstName}  ${userIdentity.lastName}`}
          </Paragraph>
          {userIdentity.position && (
            <Paragraph className='user-identity--position'>
              {userIdentity.position}
            </Paragraph>
          )}
          {userIdentity.organization && (
            <Paragraph className='user-identity--organization'>
              {userIdentity.organization}
            </Paragraph>
          )}
        </>
      )}
    </Card>
  )
}

export default IdentityCard
