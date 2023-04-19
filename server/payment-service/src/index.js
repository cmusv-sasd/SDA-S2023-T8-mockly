import express from 'express'
import cors from 'cors'
import * as Database from './utils/Database'
import PaymentMethodController from './controllers/PaymentMethodController'
//import PaymentProcessor from './controllers/processing/PaymentProcessor'
import PaypalProcessor from './controllers/processing/PaypalProcessor'

// eslint-disable-next-line no-undef
const PORT = parseInt(process.env.PORT || '3004')

const app = express().use(
  cors({
    origin: ['http://localhost:3001'],
  })
).use(express.json())

Database.connect()

app.get('/api/', (req, res) => {
  res.json({ message: 'Hello from Payment' })
})

app.post('/payment', async (req, res) => {
  const { payer, payee, match } = req.body
  const amount = 20
  var paymentProcessor = new PaypalProcessor(payer, payee, match, amount)
  const result = await paymentProcessor.processPayment()
  if (!result || !result.success) {
    res.status(400).json(result)
  }
  else if (result.redirect) {
    res.status(307).json({ Location: result.link })
  }
  else {
    res.status(200).json(result)
  }
})

app.post('/payment/confirm', async (request, response) => {
  try {
    const paypalProcessor = new PaypalProcessor()
    const res = await paypalProcessor.confirmPayment(request.body)
    if (res.success){
      response.status(200).json({ message: 'Successfuly confirmed payment'})
    }
  }
  catch (err) {
    console.error(err)
    response.status(500).json(err)
  } 
})

app.get('/payment/cancel', async (req, res) => {
  res.status(200)
})
  
app.get('/payment/payment-method', async (req, res) => {
  const userId = req.query.userId
  try {
    const paymentMethod = await PaymentMethodController.getPaymentMethodByUserId(userId)
    if (!paymentMethod) {
      return res.status(400).json({
        message: 'No payment method found'
      })
    }
    else {
      return res.status(200).json(paymentMethod)
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Error getting payment method',
      error: err,
    })
  }
})

app.post('/payment/payment-method', async (req, res) => {
  const userId = req.query.userId
  const { type, account } = req.body
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (type == 'paypal' && !emailPattern.test(account)) {
    return res.status(400).json({
      error: 'Paypal account input must be email address'
    })
  }

  try {
    const paymentMethod = await PaymentMethodController.updatePaymentMethodByUserId(userId, type, account)
    return res.status(200).json(paymentMethod)
  } catch (err) {
    return res.status(500).json({
      message: 'Error updating payment method',
      error: err,
    })
  }

})

app.delete('/payment/payment-method', (req, res) => {
  const userId = req.query.userId
  try {
    const result = PaymentMethodController.deletePaymentMethodByUserId(userId)
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({
      message: 'Error deleting payment method',
      error: err,
    })
  }

})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
