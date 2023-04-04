import {
  LockOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { Row, Form, Col, Typography, Input, Button, Alert } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'
import { setUser } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import Features from '../components/Features'

const RegistrationPage = () => {
  const [form] = useForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // shows loading icon on the button till we get registration response
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

  // navigates to the login page in login link click
  const handleLoginLink = () => {
    navigate('/login')
  }

  // handles the user's registration
  const handleRegister = async () => {
    try {
      setLoading(true)
      // validates the form and retrieve the field values
      const values = await form.validateFields()
      console.log(values)
      // send message to the register endpoint
      const res = await request('register', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      // on success response, saves the user in redux store and set's the jwt token in local storage
      if (!res.status) {
        const { token, ...fieldsToStore } = res
        dispatch(setUser(fieldsToStore))
        localStorage.setItem('token', token)
        localStorage.setItem('id', fieldsToStore.userId)
        navigate('/')
      }
    } catch (error) {
      if (error.status === 409) {
        setFormFieldError('andrewId', 'Andrew Id is already taken')
      } else {
        setErrorMessage('Unexpected error occurred. Please try again')
        console.log(error)
      }
    }
    setLoading(false)
  }

  const handleEnter = (e) => e.keyCode === 13 && handleRegister(e)

  return (
    <div>
      <Row>
        <Col xs={0} sm={0} md={10} lg={10} xl={10}>
          <div style={{ background: '#35185A', height: '100vh' }}>
            <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
              <Features />
            </Row>
          </div>
        </Col>
        <Col xs={24} sm={24} md={14} lg={14} xl={14}>
          <Row
            justify='center'
            align='middle'
            style={{ minHeight: '100vh', padding: '0 12px' }}
          >
            <div>
              <Typography.Title level={1}>Sign Up to Mockly.</Typography.Title>
              {errorMessage && (
                <Alert
                  message={errorMessage}
                  type='error'
                  style={{ marginBottom: '16px' }}
                  closable
                  onClose={() => {}}
                />
              )}
              <Form form={form} onKeyUp={handleEnter} onFinish={handleRegister}>
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
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      name='firstName'
                      rules={[
                        {
                          required: true,
                          message: 'Please input a First Name!',
                        },
                      ]}
                    >
                      <Input
                        prefix={<IdcardOutlined />}
                        placeholder='First Name'
                        style={{ width: '100%', height: '46px' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      name='lastName'
                      rules={[
                        {
                          required: true,
                          message: 'Please input a Last Name!',
                        },
                      ]}
                    >
                      <Input
                        prefix={<IdcardOutlined />}
                        placeholder='Last Name'
                        style={{ width: '100%', height: '46px' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
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
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder='Email'
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
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
              <Typography.Text>
                Already signed up?{' '}
                <Typography.Link
                  onClick={handleLoginLink}
                  style={{ color: '#1890ff' }}
                >
                  Log In
                </Typography.Link>
              </Typography.Text>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default RegistrationPage
