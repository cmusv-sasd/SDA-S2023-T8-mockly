import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { useEffect } from 'react'
import { fetchUserAPI } from '../api/userProfile'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/userSlice'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('id')
    if (!token) {
      navigate('/login')
    }

    const fetchUser = async () => {
      const res = await fetchUserAPI(uid)
      dispatch(setUser(res))
    }
    if (uid) {
      fetchUser()
    }
  }, [])

  return <Header>{children}</Header>
}

export default ProtectedRoute
