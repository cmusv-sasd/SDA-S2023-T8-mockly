import User from '../models/user'

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
