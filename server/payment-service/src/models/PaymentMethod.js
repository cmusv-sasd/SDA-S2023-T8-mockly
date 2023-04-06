
import mongoose, { Schema } from 'mongoose'

const PaymentMethodSchema = new Schema({
  // id of person
  person: {
    required: true,
    type: String
  },
  // type of payment method
  type: {
    type: String
  },
  // account details
  account: {
    type: String
  }
})

export default mongoose.model('PaymentMethods', PaymentMethodSchema)
