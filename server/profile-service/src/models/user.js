import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// eslint-disable-next-line no-undef
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10

const { Schema } = mongoose

const userSchema = new Schema({
  andrewId: String,
  password: String,
  firstName: String,
  lastName: String,
  organization: String,
  position: String,
  email: String,
  phoneNumber: String,
  pronouns: String,
  gender: String,
  ethnicity: String,
  summary: String,
  skills: [{ title: String }],
  courses: [{ title: String }],
  education: [
    {
      institution: String,
      educationLevel: String,
      degree: String,
      major: String,
      minor: String,
      startDate: String,
      endDate: String,
      gpa: Number,
    },
  ],
  experience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      location: String,
      description: String,
    },
  ],
  projects: [
    {
      title: String,
      url: String,
      description: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  type: { type: String },
  fields: [],
  time: [{ type: Number }],
})

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS)
      this.password = hashedPassword
    }
    return next()
  } catch (err) {
    return next(err)
  }
})

userSchema.methods.comparePassword = async function (plainTextPassword) {
  const passwordMatch = await bcrypt.compare(plainTextPassword, this.password)
  return passwordMatch
}

const User = mongoose.model('User', userSchema)

export default User
