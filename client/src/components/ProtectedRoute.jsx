import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { useEffect, useState } from 'react'
import { fetchUserAPI } from '../api/userProfile'
import { useDispatch } from 'react-redux'
import { setUser, userSelector } from '../store/userSlice'
import { useSelector } from 'react-redux'
import Joyride from 'react-joyride'
import IntroModal from './IntroModal'

const steps = [
  {
    target: '.create-interview',
    disableBeacon: true,
    content: 'Click this to set up a new interview.'
  },
  {
    target: '.upcoming-interviews',
    content: 'This will list all your upcoming interviews and give you the options to launch or delete them.'
  },
  {
    target: '.completed-interviews',
    content: 'This will list all your completed interviews. You can also complete feedback about the interview here.'
  },
  {
    target: '.ant-menu',
    content: 
    <div>
      Use this sidebar to navigate between pages.
      <p>
        The Profile page maintains information about you.
      </p>
      <p>
        The Feedback page allows you to customize and view your feedback. 
      </p>
      <p>
        The Payment page allows you to specify your payment method for interviews.
      </p>
    </div>,
    placement: 'top'
  },
  {
    target: '.interviewer-details',
    content: "Don't forget to specify your interviewer details! This is how others know what kind of interviewer you will be."
  },
  {
    target: '.feedback-details',
    content: 'Specify what kind of feedback you want as an interviewer and interviewer here.',
    placement: 'top'
  },
  {
    target: 'body',
    content: 'Receive feedback about your interviews here on the Interview History tab',
    placement: 'center'
  },
  {
    target: '.payment-method',
    content: 'Please fill out your payment method here on the Payment Method tab prior to scheduling any interviews!',
    placement: 'top'
  },
]


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(userSelector)

  const [introModalOpen, setIntroModalOpen] = useState(true)
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)


  useEffect(() => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('id')
    if (!token) {
      navigate('/login')
    }

    const fetchUser = async () => {
      const res = await fetchUserAPI(uid)
      const payload = { ...res, initialLogin: user.initialLogin }
      dispatch(setUser(payload))
    }
    if (uid) {
      fetchUser()
    }
  }, [])

    
  const callback = (data) => {
    const { type, index, action } = data
    if (action === 'close') {
      setRun(false)
    } else if (type === 'step:after' && index === 3) {
      setRun(false)
      navigate('/profile')
      setTimeout(() => {
        setRun(true)
        setStepIndex(index + 1)
      }, 1000)
    } else if (type === 'step:after' && index === 5) {
      setRun(false)
      navigate('/feedback')
      setTimeout(() => {
        setRun(true)
        setStepIndex(index + 1)
      }, 1000)
    } else if (type === 'step:after' && index === 6) {
      setRun(false)
      navigate('/payment')
      setTimeout(() => {
        setRun(true)
        setStepIndex(index + 1)
      }, 1000)
    } else if (type === 'step:after') {
      setStepIndex(index + 1)
    } else if (type === 'tour:end') {
      navigate('/')
    }
  }

  return (
    <>
      <Joyride 
        continuous
        run={run}
        stepIndex={stepIndex}
        showProgress
        showSkipButton
        scrollToFirstStep
        steps={steps} 
        styles={{
          buttonBack: {
            display: 'none'
          },
          options: {
            primaryColor: '#1890ff',
          }
        }}
        callback={callback}/>
        {user.initialLogin ? 
          <IntroModal isOpen={introModalOpen} setOpen={setIntroModalOpen} setRun={setRun} />
          : null
        }
        <Header>{children}</Header>
    </>
  )
}

export default ProtectedRoute
