import PaymentMethod from "../models/PaymentMethod"

export const getPaymentMethodByUserId = async (userId) => {
  const paymentMethod = await PaymentMethod.findOne({ person: userId })
  return paymentMethod
}

export const updatePaymentMethodByUserId = async (userId, type, account) => {
  const paymentMethod = await PaymentMethod.findOneAndUpdate(
    { person: userId },
    { type, account }
  )
  return paymentMethod
}

export const deletePaymentMethodByUserId = async (userId) => {
  return await this.deleteOne({ person: userId });
}
