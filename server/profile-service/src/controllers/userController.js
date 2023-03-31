import { assign, findIndex, isEmpty } from 'lodash'
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

export const createUser = async (req, res) => {
  const { andrewId, password } = req.body

  // Check if andrewId and password are provided
  if (!andrewId || !password) {
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
    const user = new User({ andrewId, password })

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

export const validateUserCredentials = async (req, res) => {
  const { andrewId, password } = req.body
  try {
    const user = await User.findOne({ andrewId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    return res.status(200).json({ userId: user._id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updatePersonalIdentity = async (req, res) => {
  const { userId, firstName, lastName, organization, position } = req.body

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

    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // Return the updated user document
    return res.status(200).json({
      message: 'Personal identity updated',
      user: updatedUser,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error updating personal identity',
      error: error,
    })
  }
}

export const updatePersonalInformation = async (req, res) => {
  const { userId, email, phoneNumber, pronouns, gender, ethnicity } = req.body

  // Check if request body contains any fields to update
  if (!email && !userId) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  try {
    // Update user document with new values
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
    if (!updatedUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    return res
      .status(200)
      .json({ message: 'Personal Information Updated', user: updatedUser })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error updating personal information',
      error: error,
    })
  }
}

// Create a new education entry for a user
export const createEducation = async (req, res) => {
  const {
    userId,
    institution,
    educationLevel,
    degree,
    major,
    minor,
    startDate,
    endDate,
    gpa,
  } = req.body

  // Check if all required fields are present
  if (!userId || !institution || !startDate) {
    return res.status(400).json({
      message:
        'Request body must contain userId, schoolName, levelOfStudy, and startDate fields',
    })
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Create a new education object and set its fields
    const newEducation = {
      institution,
      educationLevel,
      degree,
      major,
      minor,
      startDate,
      endDate,
      gpa,
    }

    // Add the education object to the user's education array
    user.education.push(newEducation)
    await user.save()

    // Return the created education object in the response
    return res.status(201).json(newEducation)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating education entry', error })
  }
}

// Update an existing education entry for a user
export const updateEducation = async (req, res) => {
  const { userId, educationId, ...updateFields } = req.body

  // Check if the request body is empty
  if (isEmpty(updateFields)) {
    return res.status(400).json({ message: 'Request body cannot be empty' })
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Find the education entry to be updated
    const educationIndex = findIndex(user.education, { _id: educationId })
    if (educationIndex === -1) {
      return res
        .status(404)
        .json({ message: `Education entry with ID ${educationId} not found` })
    }

    // Update the education entry with the new values
    assign(user.education[educationIndex], updateFields)

    // Save the updated user object
    await user.save()

    // Return the updated education object in the response
    return res.status(200).json(user.education[educationIndex])
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating education entry', error })
  }
}

// Delete an existing education entry for a user
export const deleteEducation = async (req, res) => {
  const { userId, educationId } = req.body

  try {
    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` })
    }

    // Find the education entry to be deleted
    const educationIndex = findIndex(user.education, { _id: educationId })
    if (educationIndex === -1) {
      return res
        .status(404)
        .json({ message: `Education entry with ID ${educationId} not found` })
    }

    // Remove the education entry from the user object
    user.education.splice(educationIndex, 1)

    // Save the updated user object
    await user.save()

    // Return a 204 No Content response if successful
    return res.status(204).send()
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting education entry', error })
  }
}

// Create a new skill entry for a user
export const createSkill = async (req, res) => {
  const { userId, skillName } = req.body
  // Validate request body
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
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // Return created skill object
    return res.status(201).json(user.skills.slice(-1)[0])
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating skill', error: error })
  }
}

// Delete an existing skill entry for a user
export const deleteSkill = async (req, res) => {
  const { userId, skillId } = req.body

  // Validate request body
  if (!userId || !skillId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Find user and remove skill from skills array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // Check if skill was found and removed
    if (!user) {
      return res.status(404).json({ message: 'Skill not found' })
    }

    // Return success response
    return res
      .status(200)
      .json({ message: `Skill with ID: ${skillId} deleted successfully` })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting skill', error: error })
  }
}

// Creates a new course entry for a user
export const createCourse = async (req, res) => {
  const { userId, courseName } = req.body

  if (!userId || !courseName) {
    return res.status(400).json({
      message: 'Request body must contain userId and courseName fields',
    })
  }
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: { title: courseName } } },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    return res.status(201).json(user.courses[user.courses.length - 1])
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating skill', error: error })
  }
}

// Deletes an existing course entry for a user
export const deleteCourse = async (req, res) => {
  const { userId, courseId } = req.body
  if (!userId || !courseId) {
    return res.status(400).json({
      message: 'Request body must contain userId and courseId fields',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { courses: { _id: courseId } } },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    return res
      .status(200)
      .json({ message: `Course with ID: ${courseId} deleted succesfully` })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error deleting course', error: error })
  }
}

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

export const updateSummary = async (req, res) => {
  const { userId, summary } = req.body
  // Check if request body contains required fields
  if (!userId) {
    return res.status(400).json({
      message: 'Request body must contain userId field',
    })
  }
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { summary },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    return res.status(200).json({ summary: user.summary })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating summary', error: error })
  }
}

export const updateInterviewerDetails = async (req, res) => {
  const userId = req.params.userId
  const { type, fields, time } = req.body
  if (!userId || !type || !fields || !time) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'The request body is missing one or more required fields.',
    })
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        type: type,
        fields: fields,
        time: time,
      },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found.',
      })
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the interviewer details.',
    })
  }
}
