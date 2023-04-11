import request from "../utils/request"

const processPayment = async (payload) => request(`payment`, {
  method: 'POST',
  body: JSON.stringify(payload)
})

const getPaymentMethod = async (userId) => request(`payment/payment-method?userId=${userId}`, {
  method: 'GET'
})

const updatePaymentMethod = async (userId, payload) => request(`payment/payment-method?userId=${userId}`, {
  method: 'POST',
  body: JSON.stringify(payload)
})

const deletePaymentMethod = async (userId) => request(`payment/payment-method?userId=${userId}`, {
  method: 'DELETE'
})

export { processPayment, getPaymentMethod, updatePaymentMethod, deletePaymentMethod }
