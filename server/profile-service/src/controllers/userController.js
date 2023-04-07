import { isEmpty } from 'lodash'
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

/**
 * Controller for POST /users/:userId/courses
 * Add a course entry to a user's courses list
 */
export const createCourse = async (req, res) => {
  const userId = req.params.userId
  const { courseName } = req.body

  // Validate request body, ensure user ID and course name are provided
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
    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    // Return success response
    return res.status(201).json(user.courses[user.courses.length - 1])
  } catch (error) {
    // If an error occurs during the create operation, return a 500 error with a detailed message
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error creating skill', error: error })
  }
}

/**
 * Controller for DELETE /users/:userId/courses
 * Delete an existing course entry in a user's courses list
 */
export const deleteCourse = async (req, res) => {
  const userId = req.params.userId
  const { courseId } = req.body
  console.log(courseId)
  // Validate request body, ensure user ID and course ID are provided
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
    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      })
    }
    return res
      .status(200)
      .json({ message: `Course with ID: ${courseId} deleted succesfully` })
  } catch (error) {
    // If an error occurs during the delete operation, return a 500 error with a detailed message
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
