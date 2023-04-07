import User from '../models/user'

/**
 * Controller for GET /users, GET /users?fields=firstName,lastName,type,fields,time
 * Returns list of users (by default all details except password else the fields requested in the request query)
 */
export const getUsers = async (req, res) => {
  try {
    const fields = req.query.fields ? req.query.fields.split(',').join(' ') : ''
    const allUsers = await User.find().select(`${fields} -password`)
    return res.status(200).json(allUsers)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error retrieving user',
      error: error,
    })
  }
}

/**
 * Controller for GET /users/:userId, GET /users/userId?fields=firstName,lastName,type,fields,time
 * Returns a user by ID (by default all details except password else the fields requested in the request query)
 */
export const getUserById = async (req, res) => {
  const userId = req.params.userId
  const fields = req.query.fields ? req.query.fields.split(',').join(' ') : ''
  User.findById(userId, `${fields} -password`)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: `User with ID ${userId} not found`,
        })
      }
      return res.status(200).json(user)
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).json({
        message: 'Error retrieving user',
        error: error,
      })
    })
}

/**
 * Controller for POST /users
 * Creates a new user during registration
 * Request body must contain andrewId, password, firstName, lastName, email
 */
export const createUser = async (req, res) => {
  const { andrewId, password, firstName, lastName, email } = req.body

  // Check if andrewId and password are provided
  if (!andrewId || !password || !firstName || !lastName || !email) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  try {
    // Check if the andrewId is already taken
    const existingUser = await User.findOne({ andrewId })
    if (existingUser) {
      return res.status(409).json({
        message: 'andrewId is already taken',
      })
    }

    // Create a new user document
    const user = new User({ andrewId, password, firstName, lastName, email })

    // Save the user document to the database
    await user.save()

    // Return success response with the created user document
    return res.status(201).json({
      message: 'User created successfully',
      user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error creating user',
      error,
    })
  }
}

/**
 * Controller for POST /users/credentials
 * validates username and password values with the DB values before login
 */
export const validateUserCredentials = async (req, res) => {
  const { andrewId, password } = req.body
  try {
    const user = await User.findOne({ andrewId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const isPasswordVerified = await user.comparePassword(password)
    if (!isPasswordVerified) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    // eslint-disable-next-line
    const { password: _, ...fieldsToReturn } = user.toObject()
    return res.status(200).json(fieldsToReturn)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * Controller for PUT /users/:userId/summary
 * Update summary of a particular user
 */
export const updateSummary = async (req, res) => {
  const userId = req.params.userId
  const { summary } = req.body
  // Check if request body contains required fields
  if (!userId) {
    return res.status(400).json({
      message: 'Request body must contain userId field',
    })
  }
  try {
    // Update the user's summary in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { summary },
      { new: true }
    )
    // If the user is not found, return a 404 error response
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // If the update is successful, return a 200 response with the updated summary
    return res.status(200).json({ summary: user.summary })
  } catch (error) {
    // Return a 500 error response with an appropriate message
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating summary', error: error })
  }
}

/**
 * Controller for PUT /users/:userId/interviewer-details
 * Update interviewer details (type, fields, ) of a particular user
 */
export const updateInterviewerDetails = async (req, res) => {
  const userId = req.params.userId
  const { type, fields, time } = req.body
  // Check if request contains required fields
  if (!userId || !type || !fields || !time) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'The request body is missing one or more required fields.',
    })
  }

  try {
    // Find the user by ID and update their interviewer details fields
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        type: type,
        fields: fields,
        time: time,
      },
      { new: true }
    )
    // If the user is not found, return a 404 error response
    if (!updatedUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found.',
      })
    }
    // If the update is successful, return a 200 response with the updated summary
    return res.status(200).json(updatedUser)
  } catch (error) {
    // Return a 500 error response with an appropriate message
    console.log(error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the interviewer details.',
    })
  }
}
