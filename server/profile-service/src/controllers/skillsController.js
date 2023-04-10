import User from '../models/user'

/**
 * Controller for POST /users/:userId/skills
 * Adds a new skill entry in a user's skill's list
 */
export const createSkill = async (req, res) => {
  const userId = req.params.userId
  const { skillName } = req.body

  // Validate request body, ensure user ID and skill ID are provided
  if (!userId || !skillName) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Find user and add skill to skills array
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { skills: { title: skillName } } },
      { new: true }
    )
    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // Return created skill object
    return res.status(201).json(user.skills.slice(-1)[0])
  } catch (error) {
    // If an error occurs during the create operation, return a 500 error with a detailed message
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating skill', error: error })
  }
}

/**
 * Controller for DELETE /users/:userId/skills
 * Delete an existing skill entry from a user's skills list
 */
export const deleteSkill = async (req, res) => {
  const userId = req.params.userId
  const { skillId } = req.body

  // Validate request body, ensure user ID and skill ID are provided
  if (!userId || !skillId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Find the user with the specified user ID and
    // remove the skill with the specified skill ID from the user's skills array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    )
    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // If the skill is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'Skill not found' })
    }

    // Return success response
    return res
      .status(200)
      .json({ message: `Skill with ID: ${skillId} deleted successfully` })
  } catch (error) {
    // If an error occurs during the delete operation, return a 500 error with a detailed message
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting skill', error: error })
  }
}
