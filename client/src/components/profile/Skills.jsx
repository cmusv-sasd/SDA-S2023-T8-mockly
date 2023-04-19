import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSkill, removeSkill } from '../../store/userSlice'
import { getUserSkills } from '../../store/userSelector'
import { Card, Tag, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { addSkillAPI, deleteSkillAPI } from '../../api/userProfile'
import '../../styles/profile/tags.css'

// SkillsCard component to display and manage user skills
const SkillsCard = () => {
  // Setup for Redux dispatch and user skills selector
  const dispatch = useDispatch()
  const skills = useSelector(getUserSkills)

  // State management for new skill input and loading status
  const [newSkill, setNewSkill] = useState('')
  // Set loading state to true during the API call and to false after the API call
  const [loading, setLoading] = useState(false)

  // Handle new skill input change
  const handleNewSkillChange = (event) => {
    setNewSkill(event.target.value)
  }

  // Handle add skill button click, add a new skill if the input is not empty
  const handleAddSkillClick = async () => {
    if (newSkill !== '') {
      setLoading(true)
      try {
        const userId = localStorage.getItem('id')
        const res = await addSkillAPI(userId, { skillName: newSkill })
        // Check if the API call is successful and dispatch addSkill action with response
        if (!res.status) {
          dispatch(addSkill(res))
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
      setNewSkill('') // Clear the new skill input
    }
  }

  // Handle remove skill button click, remove a skill based on its ID
  const handleRemoveSkillClick = async (skillToRemove) => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('id')
      const res = await deleteSkillAPI(userId, { skillId: skillToRemove })
      // Check if API call is successful and dispatch the removeSkill action with the skill ID
      if (!res.status) {
        dispatch(removeSkill({ skillId: skillToRemove }))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  // Render user skills as a list of tags, allowing for removal of individual skills
  const renderSkills = () => {
    return skills.map((skill) => (
      <Tag
        className='user-tag'
        closable
        key={skill._id}
        onClose={() => handleRemoveSkillClick(skill._id)}
      >
        {skill.title}
      </Tag>
    ))
  }

  // Component JSX structure
  return (
    <Card className='user-profile-card' title='Skills' loading={loading}>
      {renderSkills()}
      <div className='user-tag-actions-div'>
        <Input
          value={newSkill}
          onChange={handleNewSkillChange}
          placeholder='Add skill'
        />
        <Button
          className='user-tag-action-btn'
          type='primary'
          onClick={handleAddSkillClick}
          icon={<PlusOutlined />}
        />
      </div>
    </Card>
  )
}

export default SkillsCard
