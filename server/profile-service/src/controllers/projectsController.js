import User from '../models/user'

export const createProject = async (req, res) => {
  const {
    userId,
    projectName,
    projectDescription,
    startDate,
    endDate,
    projectLink,
  } = req.body

  // Check if required fields are present in the request body
  if (!userId || !projectName || !startDate) {
    return res.status(400).json({
      message:
        'Request body must contain userId, projectName, and startDate fields',
    })
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Create new project object
    const newProject = {
      projectName,
      projectDescription,
      startDate,
      endDate,
      projectLink,
    }

    // Add new project to user's projects array
    user.projects.push(newProject)
    await user.save()

    return res.status(201).json(newProject)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating project entry', error })
  }
}

// Function to update an existing project entry for a user
export const updateProject = async (req, res) => {
  const { userId, projectId, ...updateFields } = req.body

  // Check if required fields are present in the request body
  if (!userId || !projectId) {
    return res.status(400).json({
      message: 'Request body must contain userId and projectId fields',
    })
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Find index of project in user's projects array
    const projectIndex = user.projects.findIndex(
      (project) => project.id === projectId
    )
    if (projectIndex === -1) {
      return res
        .status(404)
        .json({ message: `Project with ID ${projectId} not found` })
    }

    // Update project object with new values
    Object.assign(user.projects[projectIndex], updateFields)
    await user.save()

    return res.status(200).json(user.projects[projectIndex])
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating project entry', error })
  }
}

// Function to delete an existing project entry for a user
export const deleteProject = async (req, res) => {
  const { userId, projectId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }

    const projectIndex = user.projects.findIndex(
      (project) => project.id === projectId
    )
    if (projectIndex === -1) {
      return res.status(404).json({
        message: `Project with ID ${projectId} not found for user with ID ${userId}`,
      })
    }

    user.projects.splice(projectIndex, 1)
    await user.save()

    return res.status(204).send()
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error deleting project',
      error: error,
    })
  }
}
