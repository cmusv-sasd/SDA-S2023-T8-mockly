import { Row, Typography, Form, Input, Select, Button } from 'antd'
import React, { useEffect } from "react"
import { useSelector } from 'react-redux'
import { userSelector } from '../store/userSlice'
import { getPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../api/payment'
import useMessage from 'antd/es/message/useMessage'

const PaymentMethodForm = () => {
  const [messageApi, contextHolder] = useMessage()
  const user = useSelector(userSelector)
  const userId = user._id

  const [form] = Form.useForm()

  useEffect(() => {
    const getInitialValues = async () => {
      const res = await getPaymentMethod(userId)
      form.setFieldsValue({ ...res })
    }
    getInitialValues()
  }, [user])
  
  const handleSubmit = async (values) => {
    try {
     await updatePaymentMethod(userId, 
        { type: values.type, account: values.account }
      )
      messageApi.open({ type: 'success', content: 'Successfully updated payment method.' })
    }
    catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: 'Failed to update payment method.' })
    }
  }

  const handleDelete = async () => {
    try {
      await deletePaymentMethod(userId)
      messageApi.open({ type: 'success', content: 'Successfully deleted payment method.' })
      form.resetFields()
    }
    catch (e) {
      console.error(e)
      messageApi.open({ type: 'error', content: 'Failed to delete payment method.' })
    }
  }

  return (
    <div className='payment-method'>
      {contextHolder}
      <Row justify='center'>
          <Typography.Title level={2}>Payment Method</Typography.Title>
        </Row>
      <Row justify='center'>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Select a payment option.' }]}>
            <Select>
              <Select.Option value="paypal">Paypal</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Account Email" name="account" rules={[{ required: true, message: 'Please enter a valid email.', type: 'email' }]}>
            <Input />
          </Form.Item>
          <Row justify='center'>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Row>
          <Row justify='center'>
            <Form.Item>
              <Button onClick={handleDelete}>Delete Existing</Button>
            </Form.Item>
          </Row>
        </Form>
      </Row>
    </div>
  )
}

export default PaymentMethodForm;