import { createSlice } from '@reduxjs/toolkit'
import { concat, reject, remove, findIndex, assign } from 'lodash'

const initialState = {
  _id: '',
  firstName: '',
  lastName: '',
  organization: '',
  position: '',
  email: '',
  phoneNumber: '',
  pronouns: '',
  gender: '',
  ethnicity: '',
  summary: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  courses: [],
  // interviewer details
  type: '',
  fields: [],
  time: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    resetUser: () => {
      return { ...initialState }
    },
    setIdentity: (state, action) => {
      const { firstName, lastName, organization, position } = action.payload
      return {
        ...state,
        firstName,
        lastName,
        organization,
        position,
      }
    },
    setSummary: (state, action) => {
      return {
        ...state,
        summary: action.payload.summary,
      }
    },
    setPersonalInformation: (state, action) => {
      const { email, phoneNumber, gender, ethnicity, pronouns } = action.payload
      return {
        ...state,
        email,
        phoneNumber,
        gender,
        ethnicity,
        pronouns,
      }
    },
    addSkill: (state, action) => {
      state.skills = concat(state.skills, action.payload)
    },
    removeSkill: (state, action) => {
      state.skills = reject(state.skills, { _id: action.payload.skillId })
    },
    addEducation: (state, action) => {
      state.education = concat(state.education, action.payload)
    },
    removeEducation: (state, action) => {
      remove(state.education, (education) => {
        return education._id === action.payload
      })
    },
    updateEducation: (state, action) => {
      const updatedEducation = action.payload
      // Find the index of the education entry to be updated in the user's education array
      const educationIndex = findIndex(state.education, {
        _id: updatedEducation._id,
      })
      // Check if the education entry exists in the user's education array
      if (educationIndex !== -1) {
        // Replace the old education entry with the updated one in the user's education array
        assign(state.education[educationIndex], updatedEducation)
      } else {
        console.log(`Education entry with ID ${updatedEducation._id} not found`)
      }
    },
    addExperience: (state, action) => {
      state.experience = concat(state.experience, action.payload)
    },
    removeExperience: (state, action) => {
      remove(state.experience, (experience) => {
        return experience._id === action.payload
      })
    },
    updateExperience: (state, action) => {
      const updatedExperience = action.payload
      // Find the index of the experience entry to be updated in the user's experience array
      const experienceIndex = findIndex(state.experience, {
        _id: updatedExperience._id,
      })
      // Check if the experience entry exists in the user's experience array
      if (experienceIndex !== -1) {
        // Replace the old experience entry with the updated one in the user's experience array
        assign(state.experience[experienceIndex], updatedExperience)
      } else {
        console.log(
          `Experience entry with ID ${updatedExperience._id} not found`
        )
      }
    },
    addProject: (state, action) => {
      state.projects = concat(state.projects, action.payload)
    },
    removeProject: (state, action) => {
      remove(state.projects, (project) => {
        return project._id === action.payload
      })
    },
    updateProject: (state, action) => {
      const updatedProject = action.payload
      // Find the index of the project entry to be updated in the user's projects array
      const projectIndex = findIndex(state.projects, {
        _id: updatedProject._id,
      })
      // Check if the project entry exists in the user's projects array
      if (projectIndex !== -1) {
        // Replace the old project entry with the updated one in the user's projects array
        assign(state.projects[projectIndex], updatedProject)
      } else {
        console.log(`Project entry with ID ${updatedProject._id} not found`)
      }
    },
    addCourse: (state, action) => {
      state.courses = concat(state.courses, action.payload)
    },
    removeCourse: (state, action) => {
      state.courses = reject(state.courses, { _id: action.payload.courseId })
    },
    setInterviewerDetails: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  setIdentity,
  setSummary,
  setPersonalInformation,
  addSkill,
  removeSkill,
  addEducation,
  removeEducation,
  updateEducation,
  addExperience,
  removeExperience,
  updateExperience,
  addProject,
  removeProject,
  updateProject,
  addCourse,
  removeCourse,
  setUser,
  setInterviewerDetails,
  resetUser,
} = userSlice.actions
export const userSelector = (state) => state.user
export default userSlice.reducer
