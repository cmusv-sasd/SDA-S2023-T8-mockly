import { validate } from '../utils/token'

// 'authenticate' middleware function to check the validity of the JWT token
const authenticate = async (req, res, next) => {
  // Retrieve the 'authorization' header from the request
  const authHeader = req.header('authorization')
  // If the 'authorization' header is not present, return a 401 status code with an error message
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header.' })
  }
  // Extract the JWT token from the 'authorization' header
  const token = authHeader.split(' ')[1]
  // Validate the JWT token using the 'validate' function from '../utils/token'
  const decoded = validate(token)
  // If the token is not valid or expired, return a 401 status code with an error message
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }
  // If the token is valid, call the 'next' function to proceed with the request chain
  return next()
}

export default authenticate
