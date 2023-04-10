import express from 'express'
import * as Database from './utils/Database'
import corsMiddleware from './middleware/corsMiddleware'
import userRoutes from './routes/userRoutes'

// eslint-disable-next-line no-undef
const PORT = parseInt(process.env.PORT || '3005')

const app = express()
  .use(corsMiddleware)
  .use(express.json())
  .use('/users', userRoutes)

Database.connect()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
