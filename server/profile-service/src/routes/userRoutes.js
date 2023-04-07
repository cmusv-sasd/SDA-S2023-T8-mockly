import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  validateUserCredentials,
  updateSummary,
  updateInterviewerDetails,
} from '../controllers/userController'

import {
  updatePersonalIdentity,
  updatePersonalInformation,
} from '../controllers/informationController'

import {
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController'

import { createSkill, deleteSkill } from '../controllers/skillsController'
import { createCourse, deleteCourse } from '../controllers/coursesController'
import {
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController'

import {
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController'

const router = Router()

// GET /users
// Get all users
router.get('/', getUsers)

// GET /users/:userId
// Get user by ID
router.get('/:userId', getUserById)

// POST /users
// Create new user
router.post('/', createUser)

// POST /users/credentials
// validate andrewId and password for login process
router.post('/credentials', validateUserCredentials)

// PUT /users/:userId/personal-identity
// Update personal identity fields for a user
router.put('/:userId/personal-identity', updatePersonalIdentity)

// PUT /users/:userId/personal-information
// Update personal information fields for a user
router.put('/:userId/personal-information', updatePersonalInformation)

// POST /users/:userId/education
// Create a new education entry for a user
router.post('/:userId/education', createEducation)

// PUT /users/:userId/education
// Update an existing education entry for a user
router.put('/:userId/education', updateEducation)

// DELETE /users/:userId/education
// Delete an existing education entry for a user
router.delete('/:userId/education', deleteEducation)

// POST /users/:userId/skills
// Create a new skill for a user
router.post('/:userId/skills', createSkill)

// DELETE /users/:userId/skills
// Delete a skill for a user
router.delete('/:userId/skills', deleteSkill)

// POST /users/:userId/courses
// Create a new course entry for a user
router.post('/:userId/courses', createCourse)

// DELETE /users/:userId/courses
// Delete an existing course entry for a user
router.delete('/:userId/courses', deleteCourse)

// POST /users/projects
// Create a new project entry for a user
router.post('/projects', createProject)

// PUT /users/projects
// Update an existing project entry for a user
router.put('/projects', updateProject)

// DELETE /users/projects
// Delete an existing project entry for a user
router.delete('/projects', deleteProject)

// POST /users/experiences
// Create a new experience entry for a user
router.post('/experiences', createExperience)

// PUT /users/experiences
// Update an existing experience entry for a user
router.put('/experiences', updateExperience)

// DELETE /users/experiences
// Delete an existing experience entry for a user
router.delete('/experiences', deleteExperience)

// PUT /users/:userId/summary
// Update the summary field for a user
router.put('/:userId/summary', updateSummary)

// PUT /users/:userId/interviewer-details
// Update the interviewer card for a user
router.put('/:userId/interviewer-details', updateInterviewerDetails)

// TODO: delete this route
// GET /users/interviewer
// Retrieves a list of interviewers and their associated skills
// Returns an array of objects, each containing the interviewer's name and their skills
router.get('/interviewer', async (req, res) => {
  const usersData = [
    {
      interviewer: 'peer',
      fields: ['DATA_STRUCTURES_ALGORITHMS', 'BACKEND'],
      time: [1648167213000, 1648167245000],
    },
    {
      interviewer: 'expert',
      fields: ['SYSTEM_DESIGN', 'BACKEND', 'FRONTEND'],
      time: [1648170011000, 1648170032000],
    },
    {
      interviewer: 'peer',
      fields: ['BEHAVIORAL', 'FRONTEND'],
      time: [1648172808000, 1648172830000],
    },
    {
      interviewer: 'peer',
      fields: ['DATA_SCIENCE', 'FRONTEND'],
      time: [1648175692000, 1648175713000],
    },
    {
      interviewer: 'expert',
      fields: ['DATA_STRUCTURES_ALGORITHMS', 'BACKEND'],
      time: [1648178480000, 1648178501000],
    },
    {
      interviewer: 'peer',
      fields: ['BEHAVIORAL', 'FRONTEND', 'BACKEND'],
      time: [1648181293000, 1648181314000],
    },
    {
      interviewer: 'expert',
      fields: ['SYSTEM_DESIGN', 'BACKEND'],
      time: [1648184085000, 1648184106000],
    },
    {
      interviewer: 'peer',
      fields: ['DATA_SCIENCE', 'FRONTEND'],
      time: [1648186897000, 1648186920000],
    },
    {
      interviewer: 'expert',
      fields: ['DATA_STRUCTURES_ALGORITHMS', 'SYSTEM_DESIGN', 'BACKEND'],
      time: [1648189698000, 1648189719000],
    },
    {
      interviewer: 'peer',
      fields: ['BEHAVIORAL', 'FRONTEND', 'DATA_SCIENCE'],
      time: [1648192510000, 1648192532000],
    },
  ]
  res.json(usersData)
})

export default router
