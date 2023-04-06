
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
    // TODO this API is not available yet
    const getRes = await fetch(
      `http://mockly-profile-service:${PORTS.PROFILE}/matches/${this.matchId}`,
      { method: 'GET' }
    )
    const match = await getRes.json()
    const rawResult = request(payer, payee, amount)
    const processedResult = processResult(rawResult)
    if (processedResult.success) {
      await fetch(
        `http://mockly-profile-service:${PORTS.PROFILE}/matches/${this.matchId}`,
        { method: 'PATCH', body: JSON.stringify(match) }
      )
    }
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