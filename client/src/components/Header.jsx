import { Layout, Menu, Button, Image, Tooltip, Grid } from 'antd'
import {
  LogoutOutlined,
  UserOutlined,
  CommentOutlined,
  CreditCardOutlined,
} from '@ant-design/icons'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch } from 'react-redux'
import Logo from '../assets/logo.png'
import { resetUser } from '../store/userSlice'
import '../styles/responsiveMargins.css'

const { useBreakpoint } = Grid

const Header = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const [collapsed, setCollapsed] = useState(false)

  const items = [
    {
      key: '1',
      icon: collapsed ? (
        <Tooltip title='Profile' placement='right'>
          <UserOutlined />
        </Tooltip>
      ) : (
        <UserOutlined />
      ),
      label: 'Profile',
      title: null,
    },
    {
      key: '2',
      icon: collapsed ? (
        <Tooltip title='Interview History' placement='right'>
          <CommentOutlined />
        </Tooltip>
      ) : (
        <CommentOutlined />
      ),
      label: 'Interview History',
      title: null,
    },
    {
      key: '3',
      icon: collapsed ? (
        <Tooltip title='Payment Method' placement='right'>
          <CreditCardOutlined />
        </Tooltip>
      ) : (
        <CreditCardOutlined />
      ),
      label: 'Payment Method',
      title: null,
    },
  ]

  const handleClick = (e) => {
    const { key } = e
    switch (key) {
      case '1':
        navigate('/profile')
        break
      case '2':
        navigate('/feedback')
        break
      case '3':
        navigate('/payment')
        break
    }
  }

  const handleLogout = () => {
    dispatch(resetUser())
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    navigate('/login')
    navigate(0)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        collapsible
        breakpoint='lg'
        collapsed={collapsed}
        collapsedWidth={screens.md ? 80 : 0}
        onCollapse={setCollapsed}
      >
        <Menu theme='dark' mode='inline' items={items} onClick={handleClick} />
      </Layout.Sider>
      <Layout className='site-layout'>
        <Layout.Header
          style={{
            padding: '0 10px',
            backgroundColor: '#35185A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <LinkContainer to='/'>
            <Image src={Logo} width={200} preview={false} />
          </LinkContainer>
          <LinkContainer to='/' onClick={handleLogout}>
            <Button type='link' className='h-100 d-flex align-items-center'>
              <div
                className='d-flex align-items-center'
                style={{ color: 'white' }}
              >
                Logout
                <LogoutOutlined style={{ marginLeft: '8px' }} />
              </div>
            </Button>
          </LinkContainer>
        </Layout.Header>
        <Layout.Content className='layout-content'>{children}</Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Header
