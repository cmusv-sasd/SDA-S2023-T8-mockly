import { Router } from 'express'
import { getPaymentMethodByUserId, updatePaymentMethodByUserId, deletePaymentMethodByUserId } from '../controllers/PaymentMethodController'
import PaymentProcessor from 'processing/PaymentProcessor'
import PaypalProcessor from 'processing/PaypalProcessor'


app.post('/payment', (req, res) => {
  const { payer, payee, match } = req.body
  // TODO: payer is probably a paypal token
  // TODO: call paypalprocessor
  var paymentProcessor = new PaymentProcessor(payer, payee, match)
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
    const paymentMethod = await getPaymentMethodByUserId(userId)
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
  const { type, account } = request.query;
  try {
    const paymentMethod = await updatePaymentMethodByUserId(userId, type, account)
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
    const result = deletePaymentMethodByUserId(userId)
  } catch (err) {
    return res.status(500).json({
      message: 'Error deleting payment method',
      error: err,
    })
  }

})
