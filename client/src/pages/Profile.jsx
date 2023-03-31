import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'antd'
import IdentityCard from '../components/profile/Identity'
import SkillsCard from '../components/profile/Skills'
import CoursesCard from '../components/profile/Courses'
import PersonalInformationCard from '../components/profile/PersonalInformation'
import SummaryCard from '../components/profile/Summary'
import EducationCard from '../components/profile/Education'
import ExperienceCard from '../components/profile/Experience'
import ProjectsCard from '../components/profile/Projects'
import InterviewerDetailsCard from '../components/profile/InterviewerDetails'
import { fetchUserAPI } from '../api/userProfile'
import { setUser } from '../store/userSlice'

import '../styles/profile.css'

const ProfilePage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetchUserAPI()
        console.log('Profile Page', response)
        dispatch(setUser(response))
      } catch (error) {
        console.error(error)
      }
    }
    getUserDetails()
  }, [dispatch])

  return (
    <div className='user-profile'>
      <Row justify='center' gutter={[16, 16]}>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <IdentityCard />
          <PersonalInformationCard />
          <SkillsCard />
          <CoursesCard />
        </Col>
        <Col xs={24} sm={24} md={14} lg={14} xl={14}>
          <SummaryCard />
          <InterviewerDetailsCard />
          <EducationCard />
          <ExperienceCard />
          <ProjectsCard />
        </Col>
      </Row>
    </div>
  )
}

export default ProfilePage
