import { Layout, Menu, Button, Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch } from 'react-redux'
import Logo from '../assets/logo.png'
import { resetUser } from '../store/userSlice'

const items = [
  { key: '1', label: 'Profile' },
  { key: '2', label: 'Interview History' },
]

const Header = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClick = (e) => {
    const { key } = e
    switch (key) {
      case '1':
        navigate('/profile')
        break
      case '2':
        navigate('/feedback')
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
      <Layout.Sider collapsible>
        <Menu theme='dark' mode='inline' items={items} onClick={handleClick} />
      </Layout.Sider>
      <Layout className='site-layout'>
        <Layout.Header
          style={{
            paddingLeft: 10,
            backgroundColor: '#35185A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <LinkContainer to='/dashboard'>
            <Image src={Logo} width={200} preview={false} />
          </LinkContainer>
          <LinkContainer to='/' onClick={handleLogout}>
            <Button type='link'>
              <div style={{ color: 'white' }}>Logout</div>
            </Button>
          </LinkContainer>
        </Layout.Header>
        <Layout.Content className='m-5'>{children}</Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Header
