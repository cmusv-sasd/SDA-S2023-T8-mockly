import PaymentMethod from "../models/PaymentMethod"

class PaymentMethodController {
  async getPaymentMethodByUserId(userId) {
    const paymentMethod = await PaymentMethod.findOne({ person: userId })
    return paymentMethod
  }

  async updatePaymentMethodByUserId(userId, type, account) {
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { person: userId },
      { person: userId, type, account },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    return paymentMethod
  }

  async deletePaymentMethodByUserId(userId) {
    return await PaymentMethod.findOneAndDelete({ person: userId });
  }
}

export default new PaymentMethodController
