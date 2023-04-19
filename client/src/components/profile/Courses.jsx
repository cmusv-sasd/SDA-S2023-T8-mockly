import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCourse, removeCourse } from '../../store/userSlice'
import { getUserCourses } from '../../store/userSelector'
import { Card, Tag, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { addCourseAPI, deleteCourseAPI } from '../../api/userProfile'
import '../../styles/profile/tags.css'

// CoursesCard component to display and manage user courses
const CoursesCard = () => {
  // Setup for Redux dispatch and user courses selector
  const dispatch = useDispatch()
  const courses = useSelector(getUserCourses)

  // State management for new course input and loading status
  const [newCourse, setNewCourse] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle new course input change, update the state with the input value
  const handleNewCourseChange = (event) => {
    setNewCourse(event.target.value)
  }

  // Handle add course button click, add a new course if the input is not empty
  const handleAddCourseClick = async () => {
    if (newCourse !== '') {
      setLoading(true)
      try {
        const userId = localStorage.getItem('id')
        const res = await addCourseAPI(userId, { courseName: newCourse })
        dispatch(addCourse(res))
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
      setNewCourse('')
    }
  }

  // Handle remove course button click, remove a course based on its title
  const handleRemoveCourseClick = async (courseToRemove) => {
    setLoading(true)
    try {
      const userId = localStorage.getItem('id')
      const res = await deleteCourseAPI(userId, { courseId: courseToRemove })
      if (!res.status) {
        dispatch(removeCourse({ courseId: courseToRemove }))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  // Render user courses as a list of tags, allowing for removal of individual courses
  const renderCourses = () => {
    return courses.map((course) => (
      <Tag
        className='user-tag'
        closable
        key={course._id}
        onClose={() => handleRemoveCourseClick(course._id)}
      >
        {course.title}
      </Tag>
    ))
  }

  // Component JSX structure
  return (
    <Card className='user-profile-card' title='Courses' loading={loading}>
      {renderCourses()}
      <div className='user-tag-actions-div'>
        <Input
          value={newCourse}
          onChange={handleNewCourseChange}
          placeholder='Add course'
        />
        <Button
          className='user-tag-action-btn'
          type='primary'
          onClick={handleAddCourseClick}
          icon={<PlusOutlined />}
        />
      </div>
    </Card>
  )
}

export default CoursesCard
