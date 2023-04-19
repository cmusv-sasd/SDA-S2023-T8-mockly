import React, { useState } from 'react'
import { Card, Typography, Form, Input, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSummary } from '../../store/userSelector'
import { setSummary } from '../../store/userSlice'
import { updateSummaryAPI } from '../../api/userProfile'

const { Text } = Typography

const SummaryCard = () => {
  const dispatch = useDispatch()
  const [form] = useForm()

  const label =
    'What are you passionate about? What are you looking for on Mockly?'

  // set editMode to true for edit mode else false for display mode
  const [editMode, setEditMode] = useState(false)
  // set loading to true to show loading indicator else false to hide the indicator
  const [loading, setLoading] = useState(false)

  // Get the user's summary from the Redux store
  const userSummary = useSelector(getUserSummary)

  // Initialize form values with the current user summary
  const initiateValues = () => {
    form.setFieldsValue({
      summary: userSummary.summary,
    })
  }

  // Toggle the edit mode and initialize form values when the edit button is clicked
  const handleEditClick = () => {
    setEditMode((prevEditMode) => !prevEditMode)
    initiateValues()
  }

  // Handle saving the form by updating the summary through API and updating the Redux store
  const handleSaveClick = async () => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('id')
      // Validate and get the form values
      const formValues = await form.validateFields()
      // Call the API to update the summary with the new form values
      const res = await updateSummaryAPI(userId, { ...formValues })
      // If the update is successful, update the summary in the Redux store
      if (!res.status) {
        dispatch(setSummary(res))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setEditMode(false)
  }

  const handleCancelClick = () => {
    initiateValues()
    setEditMode(false)
  }

  return (
    <Card
      className='user-profile-card'
      title='Summary'
      loading={loading}
      extra={
        <Button type='text' onClick={handleEditClick}>
          <EditOutlined />
        </Button>
      }
    >
      {editMode ? (
        <Form form={form} layout='vertical' onFinish={handleSaveClick}>
          <Form.Item name='summary' label={label}>
            <Input.TextArea
              name='summary'
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
          <Form.Item>
            <div className='user-right-card--button-container'>
              <Button
                className='user-right-card--cancel-btn'
                type='default'
                shape='round'
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                className='user-right-card--save-btn'
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
          <Text>{userSummary.summary}</Text>
        </>
      )}
    </Card>
  )
}

export default SummaryCard
