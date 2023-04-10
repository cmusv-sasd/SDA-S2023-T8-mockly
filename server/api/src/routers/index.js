import { Router } from 'express'
import login from './login'
import matching from './matching'
import profileRoutes from './profile'
import registerRoute from './register'
import paymentRoute from './payment'
import feedbackRoute from './feedback'
import authenticate from '../middlewares/authenticate'


export default Router()
  .use('/login', login)
  .use('/register', registerRoute)
  .use('/users', authenticate, profileRoutes)
  .use('/matching', authenticate, matching)
  .use('/payment', authenticate, paymentRoute)
  .use('/feedback', authenticate, feedbackRoute)
  .get('/healthcheck', (_req, res) => res.sendStatus(200))
