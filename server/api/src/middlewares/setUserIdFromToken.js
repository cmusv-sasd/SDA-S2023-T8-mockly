// TODO: Remove this file (unused)
import { validate } from '../utils/token'

/** This middleware function extracts the authentication token from the request header,
 * and sets the user ID in the request body.
 */
export const setUserIdFromToken = async (req, res, next) => {
  // Extract the authentication token from the request header.
  const authHeader = req.header('authorization')

  // Extract the token value from the header.
  const token = authHeader.split(' ')[1]

  // Validate the token to get the decoded payload, which includes the user ID.
  const decodedToken = validate(token)

  // Set the user ID in the request body for use in subsequent middleware or route handlers.
  req.body.userId = decodedToken.uid
  return next()
}
