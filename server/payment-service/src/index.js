import express from 'express'
import cors from 'cors'
import * as Database from './utils/Database'
import paymentRoutes from './routes/paymentRoutes'

// eslint-disable-next-line no-undef
const PORT = parseInt(process.env.PORT || '3004')

const app = express().use(
  cors({
    origin: ['http://localhost:3001'],
  })
)

app.use(express.json())
app.get('/api/', (req, res) => {
  res.json({ message: 'Hello from Payment' })
})
app.use('/payment', paymentRoutes)

Database.connect()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
