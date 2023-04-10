import User from '../models/user'

/**
 * Controller for PUT /users/:userId/personal-identity
 * updates personal identity (firstName, lastName, position, organization) for a particular user
 */
export const updatePersonalIdentity = async (req, res) => {
  const userId = req.params.userId
  const { firstName, lastName, organization, position } = req.body

  // Check if request body contains required fields
  if (!userId || !firstName) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  try {
    // Find the user by ID and update their personal identity fields
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        organization,
        position,
      },
      { new: true }
    )
    // if user was not found return 404 error
    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // if user was not found return 404 error
    return res.status(200).json({
      message: 'Personal identity updated',
    })
  } catch (error) {
    // if user was not found return 404 error
    console.error(error)
    return res.status(500).json({
      message: 'Error updating personal identity',
      error: error,
    })
  }
}

/**
 * Controller for PUT /users/:userId/personal-information
 * updates personal information (email, phone number, gender, pronouns, ethnicity)
 */
export const updatePersonalInformation = async (req, res) => {
  const userId = req.params.userId
  const { email, phoneNumber, pronouns, gender, ethnicity } = req.body

  // Check if request body contains required fields
  if (!email && !userId) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  try {
    // Find the user by ID and update their personal information fields
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        email,
        phoneNumber,
        pronouns,
        gender,
        ethnicity,
      },
      { new: true }
    )
    // if user was not found return 404 error
    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // if user was not found return 404 error
    return res.status(200).json({ message: 'Personal Information Updated' })
  } catch (error) {
    // if user was not found return 404 error
    console.error(error)
    return res.status(500).json({
      message: 'Error updating personal information',
      error: error,
    })
  }
}
