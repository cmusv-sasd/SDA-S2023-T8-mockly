import User from '../models/user'

/**
 * Controller for POST /users/:userId/education
 * adds new education details entry to user's education list
 */
export const createEducation = async (req, res) => {
  const userId = req.params.userId
  const { schoolName, educationLevel, major, minor, startDate, endDate, gpa } =
    req.body

  // Check if all required fields are present
  if (!userId || !schoolName || !startDate || !educationLevel || !major) {
    return res.status(400).json({
      message:
        'Request body must contain userId, schoolName, educationLevel, major and startDate fields',
    })
  }

  try {
    // Create a new education object and set its fields
    const newEducation = {
      schoolName,
      educationLevel,
      major,
      minor,
      startDate,
      endDate,
      gpa,
    }

    // Use findOneAndUpdate to add the new education object to the user's education array,
    // and return the updated user object
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { education: newEducation } },
      { new: true, upsert: false, runValidators: true }
    )

    // return 404 error if result is null as the user is not found
    if (!result) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Get the newly added education object
    const addedEducation = result.education[result.education.length - 1]

    // Return status 201 with the created education object in the response
    return res.status(201).json(addedEducation)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating education entry', error })
  }
}

/**
 * Controller for PUT /users/:userId/education
 * Update an existing education entry for a particular user
 */
export const updateEducation = async (req, res) => {
  const userId = req.params.userId
  const { educationId, ...updateFields } = req.body

  // Check if the request body is empty
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' })
  }

  try {
    // Find and update the education entry
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'education._id': educationId },
      {
        $set: Object.entries(updateFields).reduce(
          (acc, [key, value]) => ({ ...acc, [`education.$.${key}`]: value }),
          {}
        ),
      },
      { new: true }
    )

    // Check if the user and education entry exist
    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} or education entry with ID ${educationId} not found`,
      })
    }

    // Find the updated education object in the user's education array
    const updatedEducation = updatedUser.education.find(
      (education) => education._id.toString() === educationId
    )

    // Return the updated education object in the response
    return res.status(200).json(updatedEducation)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating education entry', error })
  }
}

/**
 * Controller for DELETE /users/:userId/education
 * delete an existing education entry for a user
 */
export const deleteEducation = async (req, res) => {
  const userId = req.params.userId
  const { educationId } = req.body

  // Check if userId and educationId are present
  if (!userId || !educationId) {
    return res.status(400).json({
      message:
        'Request must contain userId (in URL params) and educationId (in request body)',
    })
  }

  try {
    // Use findOneAndUpdate to find the user and remove the education entry with the specified educationId
    // Return the updated user object if successful
    const result = await User.findOneAndUpdate(
      userId,
      { $pull: { education: { _id: educationId } } },
      { new: true }
    )

    // If the result is null, the user was not found
    if (!result) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Check if the education entry was removed by comparing the updated user object's education array length
    const entryRemoved = result.education.some(
      (entry) => entry._id.toString() === educationId
    )

    // If the education entry was not removed, it was not found
    if (!entryRemoved) {
      return res
        .status(404)
        .json({ message: `Education entry with ID ${educationId} not found` })
    }

    // Return a 200 response with a success message if the operation was successful
    return res.status(200).json({
      message: `Education entry with ID ${educationId} deleted successfully`,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting education entry', error })
  }
}
