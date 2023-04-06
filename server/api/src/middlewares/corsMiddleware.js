import cors from 'cors'

const corsMiddleware = cors({
  // Set the allowed origins for cross-origin requests
  origin: ['http://localhost:3000', 'http://127.0.0.1'],
  // Uncomment the lines below to further configure allowed methods and headers
  // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  // allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
})

// Additional options to configure - https://github.com/expressjs/cors#configuration-options

export default corsMiddleware
