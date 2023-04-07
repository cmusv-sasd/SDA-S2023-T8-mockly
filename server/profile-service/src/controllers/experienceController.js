import { isEmpty } from 'lodash'
import User from '../models/user'

// Create a new experience entry for a user
export const createExperience = async (req, res) => {
  const { userId, companyName, position, startDate, endDate, description } =
    req.body

  // Check if request body contains all required fields
  if (!userId || !companyName || !position || !startDate) {
    return res.status(400).json({
      message:
        'Request body must contain userId, companyName, position and startDate',
    })
  }

  try {
    // Find the user document and add the new experience to the experience array
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          experience: {
            companyName,
            position,
            startDate,
            endDate,
            description,
          },
        },
      },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // Return the newly created experience object
    const newExperience = user.experience.slice(-1)[0]
    return res.status(201).json(newExperience)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error creating experience',
      error: error,
    })
  }
}

// Update an existing experience entry for a user
export const updateExperience = async (req, res) => {
  const { experienceId, userId, ...updateObject } = req.body

  // Check if request body contains at least one field to update
  if (isEmpty(updateObject)) {
    return res.status(400).json({
      message: 'Request body must contain at least one field to update',
    })
  }

  try {
    // Find the user document and the experience to update
    const user = await User.findOneAndUpdate(
      { _id: userId, 'experience._id': experienceId },
      {
        $set: {
          'experience.$': {
            ...updateObject,
          },
        },
      },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} or experience with ID ${experienceId} not found`,
      })
    }
    // Return the updated experience object
    const updatedExperience = user.experience.find(
      (exp) => exp._id.toString() === experienceId
    )
    return res.status(200).json(updatedExperience)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error updating experience',
      error: error,
    })
  }
}

export const deleteExperience = async (req, res) => {
  try {
    const { userId, experienceId } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { experience: { _id: experienceId } } },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
