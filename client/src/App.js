import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/Dashboard'
import PaymentMethodForm from './pages/PaymentMethod'
import FeedbackHistoryPage from './pages/FeedbackHistory'
import FeedbackPage from './pages/Feedback'
import ProfilePage from './pages/Profile'
import RegistrationPage from './pages/Registration'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/payment'
          element={
            <ProtectedRoute>
              <PaymentMethodForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='/feedback'
          element={
            <ProtectedRoute>
              <FeedbackHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/sendFeedback'
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<LandingPage />} />
        <Route path='/registration' element={<RegistrationPage />} />
      </Routes>
    </Router>
  )
}

export default App
