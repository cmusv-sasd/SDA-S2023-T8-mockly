import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Row, Col, Form, Typography, Input, Button, Alert } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'
import { setUser } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import Features from '../components/Features'

const Landing = () => {
  const [form] = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // shows loading icon on the button till we get login api response
  const [loading, setLoading] = useState(false)
  // to display error for the entire form as an alert
  const [errorMessage, setErrorMessage] = useState(null)

  // displays error message below the form field
  const setFormFieldError = (fieldName, errorMessage) => {
    form.setFields([
      {
        name: fieldName,
        errors: [errorMessage],
      },
    ])
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await request('login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      if (!res.status) {
        const { token, ...fieldsToStore } = res
        dispatch(setUser(fieldsToStore))
        localStorage.setItem('token', token)
        localStorage.setItem('id', fieldsToStore._id)
        navigate('/')
      }
    } catch (error) {
      if (error.status === 404) {
        setFormFieldError('andrewId', 'Andrew Id does not exists.')
      } else if (error.status === 401) {
        setFormFieldError('password', 'Password does not match.')
      } else {
        setErrorMessage('Unexpected error occurred. Please try again.')
        console.log(error)
      }
    }
    setLoading(false)
  }

  const handleRegisterLink = async () => {
    navigate('/registration')
  }

  const handleEnter = (e) => e.keyCode === 13 && handleLogin(e)

  return (
    <div>
      <Row>
        <Col xs={0} sm={0} md={12} lg={10} xl={10}>
          <div style={{ background: '#35185A', height: '100vh' }}>
            <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
              <Features />
            </Row>
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={14} xl={14}>
          <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
            <div>
              <Typography.Title level={1}>Log In to Mockly.</Typography.Title>
              {errorMessage && (
                <Alert
                  message={errorMessage}
                  type='error'
                  style={{ marginBottom: '16px' }}
                  closable
                  onClose={() => {}}
                />
              )}
              <Form form={form} onKeyUp={handleEnter} onFinish={handleLogin}>
                <Form.Item
                  name='andrewId'
                  rules={[
                    { required: true, message: 'Please input a Andrew ID!' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder='Andrew ID'
                    style={{ width: '100%', height: '46px' }}
                  />
                </Form.Item>
                <Form.Item
                  name='password'
                  rules={[
                    { required: true, message: 'Please input a Password!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='Password'
                    style={{ width: '100%', height: '46px' }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType='submit'
                    type='primary'
                    style={{ width: '100%', height: '46px' }}
                    loading={loading}
                  >
                    Log In
                  </Button>
                </Form.Item>
              </Form>
              <Typography.Text>
                Have no account yet?{' '}
                <Typography.Link
                  onClick={handleRegisterLink}
                  style={{ color: '#1890ff' }}
                >
                  Sign Up
                </Typography.Link>
              </Typography.Text>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Landing
