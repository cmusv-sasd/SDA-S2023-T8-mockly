import PaymentMethod from "../models/PaymentMethod"

class PaymentMethodController {
  async getPaymentMethodByUserId(userId) {
    const paymentMethod = await PaymentMethod.findOne({ person: userId })
    return paymentMethod
  }

  async updatePaymentMethodByUserId(userId, type, account) {
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { person: userId },
      { type, account }
    )
    return paymentMethod
  }

  async deletePaymentMethodByUserId(userId) {
    return await this.deleteOne({ person: userId });
  }
}

export default new PaymentMethodController
