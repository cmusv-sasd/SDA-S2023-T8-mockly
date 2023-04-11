import { Row, Typography, Form, Input, Select, Button } from 'antd'
import React from "react"
import { useSelector } from 'react-redux'
import { userSelector } from '../store/userSlice'
import { getPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../api/payment'

const PaymentMethodForm = () => {

  const user = useSelector(userSelector)
  const userId = user._id

  const [form] = Form.useForm()

  const getInitialValues = async () => {
    try {
      const res = await getPaymentMethod(userId)
      if(res.status === 200){
        return {
          type: res.body.type,
          account: res.body.account
        }
      } else {
        return {}
      }
    } 
    catch (e) {
      console.log(e)
      return {}
    }
  }
  
  const handleSubmit = (values) => {
    try {
      const res = updatePaymentMethod(userId, 
        { type: values.type, account: values.account }
      )
      if (res.status === 200) {
        // TODO: show success
        console.log(res.status)
      }
      else {
        // TODO: show invalid input
        console.log(res.status)
      }
    }
    catch (e) {
      // TODO: show system error
      console.log(e)
    }
  }

  const handleDelete = () => {
    try {
      const res = deletePaymentMethod(userId)
      if (res.status === 200) {
        form.resetFields()
      }
      else {
        // TODO: shouldn't be reached
        console.log(res.status)
      }
    }
    catch (e) {
      // TODO: show system error
      console.log(e)
    }
  }

  return (
    <div className='payment-method'>
      <Row justify='center'>
          <Typography.Title level={2}>Payment Method</Typography.Title>
        </Row>
      <Row justify='center'>
        <Form onFinish={handleSubmit} initialValues={getInitialValues()}>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: '-- Select a payment option --' }]}>
            <Select>
              <Select.Option value="paypal">Paypal</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Account" name="account" rules={[{ required: true, message: 'Please enter your account' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button onClick={handleDelete}>Delete Existing</Button>
          </Form.Item>
        </Form>
      </Row>
    </div>
  )
}

export default PaymentMethodForm;