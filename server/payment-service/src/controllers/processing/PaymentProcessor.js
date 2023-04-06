
import fetch from 'node-fetch'
import { getPaymentMethodByUserId } from '../controllers/PaymentMethodController'

class paymentProcessor {
  constructor(payerId, payeeId, matchId) {
    this.payerId = payerId
    this.payeeId = payeeId
    this.matchId = matchId
  }

  async processPayment() {
    const amount = 20
    const payer = await fetchPaymentMethod(payerId)
    if (!payer || payer.error) {
      return { success: false, message: "payer account cannot be fetched" }
    }

    const payee = await fetchPaymentMethod(payeeId)
    if (!payee || payee.error) {
      return { success: false, message: "payee account cannot be fetched" }
    }
    const result = request(payer, payee, amount)
    const processedResult = processResult(result)
    // TODO update isPaid
    const res = await fetch(`http://mockly-profile-service:${PORTS.PROFILE}/interviews`, { method: 'GET' })
    const match = await res.json()
    return processedResult
  }

  async fetchPaymentMethod(userId) {
    const user = await getPaymentMethodByUserId(userId)
    return user
  }

  async request(payer, payee, amount) {
    console.log('Mock API request made.')
    console.log(payer, payee, amount)
    const time = Date.now()
    return { success: true, payer, payee, amount, time }
  }
  
  processResult(result) {
    return result
  }

}