
import fetch from 'node-fetch'
import PaymentMethodController from '../PaymentMethodController'

import { PORTS } from '../../utils/constants'

class PaymentProcessor {
  
  // ============ Template methods ============

  constructor(payerId, payeeId, matchId, amount) {
    this.payerId = payerId
    this.payeeId = payeeId
    this.matchId = matchId
    this.amount = amount
  }

  async processPayment() {
    const payer = await this.fetchPaymentMethod(this.payerId)
    if (!payer || payer.error) {
      return { success: false, message: "payer account cannot be fetched" }
    }
    const payee = await this.fetchPaymentMethod(this.payeeId)
    if (!payee || payee.error) {
      return { success: false, message: "payee account cannot be fetched" }
    }
    const rawRequestResult = this.request(payer, payee, this.amount)
    const processedResult = this.processRequestResult(rawRequestResult)
    return processedResult
  }
  
  async confirmPayment(payload) {
    const rawConfirmResult = this.confirm(payload)
    const processedResult = this.processConfirmResult(rawConfirmResult)
    if (processedResult.success) {
      const patch = {isPaid: true}
      await fetch(
        `http://mockly-matching-service:${PORTS.MATCHING}/matches/${this.matchId}`,
        { method: 'PATCH', body: JSON.stringify(patch) }
      )
    }
    return processedResult
  }

  async fetchPaymentMethod(userId) {
    const user = await PaymentMethodController.getPaymentMethodByUserId(userId)
    return user
  }


  // ============ Custom methods ============

  async request(payer, payee, amount) {
    console.log('Mock API request made.')
    console.log(payer, payee, amount)
    const time = Date.now()
    return { success: true, payer, payee, amount, time }
  }

  async confirm(payload) {
    console.log('Mock API payment confirmed.')
    console.log(payload)
    const time = Date.now()
    return { success: true, payload, time }
  }
  
  processRequestResult(result) {
    return result
  }

  processConfirmResult(result) {
    return result
  }

}

export default PaymentProcessor