import User from '../models/user'

/**
 * Controller for POST /users/:userId/projects
 * adds new project details entry to user's projects list
 */
export const createProject = async (req, res) => {
  const userId = req.params.userId
  const { title, url, startDate, endDate, description } = req.body

  // Check if required fields are present in the request body
  if (!userId || !title) {
    return res.status(400).json({
      message: 'Request must contain userId and title fields',
    })
  }

  try {
    // Create a new project object and set its fields
    const newProject = {
      title,
      url,
      startDate,
      endDate,
      description,
    }

    // Use findOneAndUpdate to add the new project object to the user's project array,
    // and return the updated user object
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { projects: newProject } },
      { new: true, upsert: false, runValidators: true }
    )

    // return 404 error if result is null as the user is not found
    if (!result) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Get the newly added project object
    const addedProject = result.projects[result.projects.length - 1]

    // Return status 201 with the created project object in the response
    return res.status(201).json(addedProject)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating project entry', error })
  }
}

/**
 * Controller for PUT /users/:userId/projects
 * Update an existing project entry for a particular user
 */
export const updateProject = async (req, res) => {
  const userId = req.params.userId
  const { projectId, ...updateFields } = req.body

  // Check if the request body is empty
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' })
  }

  try {
    // Find and update the project entry
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, 'projects._id': projectId },
      {
        $set: Object.entries(updateFields).reduce(
          (acc, [key, value]) => ({ ...acc, [`projects.$.${key}`]: value }),
          {}
        ),
      },
      { new: true }
    )

    // Check if the user and project entry exist
    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} or project entry with ID ${projectId} not found`,
      })
    }

    // Find the updated project object in the user's project array
    const updatedProject = updatedUser.projects.find(
      (project) => project._id.toString() === projectId
    )

    // Return the updated project object in the response
    return res.status(200).json(updatedProject)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating project entry', error })
  }
}

/**
 * Controller for DELETE /users/:userId/projects
 * delete an existing project entry for a user
 */
export const deleteProject = async (req, res) => {
  const userId = req.params.userId
  const { projectId } = req.body

  // Check if userId and projectId are present
  if (!userId || !projectId) {
    return res.status(400).json({
      message:
        'Request must contain userId (in URL params) and projectId (in request body)',
    })
  }

  try {
    // Use findOneAndUpdate to find the user and remove the project entry with the specified projectId
    // Return the updated user object if successful
    const result = await User.findOneAndUpdate(
      userId,
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    )

    // If the result is null, the user was not found
    if (!result) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Check if the project entry was removed by comparing the updated user object's project array length
    const entryRemoved = result.projects.some(
      (entry) => entry._id.toString() === projectId
    )

    // If the project entry was not removed, it was not found
    if (!entryRemoved) {
      return res
        .status(404)
        .json({ message: `Project entry with ID ${projectId} not found` })
    }

    // Return a 200 response with a success message if the operation was successful
    return res.status(200).json({
      message: `Project entry with ID ${projectId} deleted successfully`,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting project entry', error })
  }
}
