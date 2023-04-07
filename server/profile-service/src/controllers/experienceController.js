import User from '../models/user'

/**
 * Controller for POST /users/:userId/experiences
 * adds new experience details entry to user's experience list
 */
export const createExperience = async (req, res) => {
  const userId = req.params.userId
  const { companyName, position, startDate, endDate, location, description } =
    req.body

  // Check if all required fields are present
  if (!userId || !companyName || !position || !startDate) {
    return res.status(400).json({
      message:
        'Request body must contain userId, companyName, position, and startDate fields',
    })
  }

  try {
    // Create a new experience object and set its fields
    const newExperience = {
      companyName,
      position,
      startDate,
      endDate,
      location,
      description,
    }

    // Use findOneAndUpdate to add the new experience object to the user's experience array,
    // and return the updated user object
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { experience: newExperience } },
      { new: true, upsert: false, runValidators: true }
    )

    // return 404 error if result is null as the user is not found
    if (!result) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Get the newly added experience object
    const addedExperience = result.experience[result.experience.length - 1]

    // Return status 201 with the created experience object in the response
    return res.status(201).json(addedExperience)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating experience entry', error })
  }
}

/**
 * Controller for PUT /users/:userId/experiences
 * Update an existing experience entry for a particular user
 */
export const updateExperience = async (req, res) => {
  const userId = req.params.userId
  const { experienceId, ...updateFields } = req.body

  // Check if the request body is empty
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' })
  }

  try {
    // Find and update the experience entry
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'experience._id': experienceId },
      {
        $set: Object.entries(updateFields).reduce(
          (acc, [key, value]) => ({ ...acc, [`experience.$.${key}`]: value }),
          {}
        ),
      },
      { new: true }
    )

    // Check if the user and experience entry exist
    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} or experience entry with ID ${experienceId} not found`,
      })
    }

    // Find the updated experience object in the user's experience array
    const updatedExperience = updatedUser.experience.find(
      (experience) => experience._id.toString() === experienceId
    )

    // Return the updated experience object in the response
    return res.status(200).json(updatedExperience)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating experience entry', error })
  }
}

/**
 * Controller for DELETE /users/:userId/experiences
 * delete an experience entry for a user
 */
export const deleteExperience = async (req, res) => {
  const userId = req.params.userId
  const { experienceId } = req.body

  // Check if userId and experienceId are present
  if (!userId || !experienceId) {
    return res.status(400).json({
      message:
        'Request must contain userId (in URL params) and experienceId (in request body)',
    })
  }

  try {
    // Use findOneAndUpdate to find the user and remove the experience entry with the specified experienceId
    // Return the updated user object if successful
    const result = await User.findOneAndUpdate(
      userId,
      { $pull: { experience: { _id: experienceId } } },
      { new: true }
    )

    // If the result is null, the user was not found
    if (!result) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Check if the experience entry was removed by comparing the updated user object's experience array length
    const entryRemoved = result.experience.some(
      (entry) => entry._id.toString() === experienceId
    )

    // If the experience entry was not removed, it was not found
    if (!entryRemoved) {
      return res
        .status(404)
        .json({ message: `Experience entry with ID ${experienceId} not found` })
    }

    // Return a 200 response with a success message if the operation was successful
    return res.status(200).json({
      message: `Experience entry with ID ${experienceId} deleted successfully`,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting experience entry', error })
  }
}
