import express from 'express'
import cors from 'cors'
import * as Database from './utils/Database'
import PaymentMethodController from './controllers/PaymentMethodController'
import PaymentProcessor from './controllers/processing/PaymentProcessor'

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

app.post('/payment', (req, res) => {
  const { payer, payee, match } = req.body
  const amount = 20
  var paymentProcessor = new PaymentProcessor(payer, payee, match, amount)
  const result = paymentProcessor.processPayment()
  if (result.error) {
    res.status(400).json(result)
  }
  else {
    res.status(200).json(result)
  }
})
  
app.get('/payment-method', async (req, res) => {
  const userId = req.params.userId
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

app.post('/payment-method', async (req, res) => {
  const userId = req.params.userId
  const { type, account } = req.query;
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

app.delete('/payment-method', (req, res) => {
  const userId = req.params.userId
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
