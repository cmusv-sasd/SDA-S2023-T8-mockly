import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  List,
} from 'antd'
import {
  PlusOutlined,
  LinkOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import { useSelector, useDispatch } from 'react-redux'
import { getUserProjects } from '../../store/userSelector'
import { addProject, removeProject, updateProject } from '../../store/userSlice'
import {
  addProjectDetailsAPI,
  deleteProjectDetailsAPI,
  updateProjectDetailsAPI,
} from '../../api/userProfile'
import dayjs from 'dayjs'
import '../../styles/profile/detailsList.css'

const { Paragraph } = Typography
const { Item } = List

const ProjectsCard = () => {
  // initial state of the form when adding new project details
  const initialFormState = {
    title: '',
    url: '',
    startDate: null,
    endDate: null,
    description: '',
  }

  const dispatch = useDispatch()
  const [form] = useForm()

  // set addProjectMode to true to display a form for adding new project details
  const [addProjectMode, setAddProjectMode] = useState(false)
  // set loading to true to see loading spinner else false to hide the spinner
  const [loading, setLoading] = useState(false)
  // set the project details that is to be edited
  const [selectedProject, setSelectedProject] = useState(null)

  // Retrieve the user's project details list from the Redux store
  const userProjectsList = useSelector(getUserProjects)

  // useEffect to initiate form values when the selectedProject state changes
  useEffect(() => {
    if (selectedProject) {
      initiateValues(selectedProject)
    }
  }, [selectedProject, form])

  // Set the initial form values depending on whether an project entry is being edited or not
  const initiateValues = (project) => {
    // if project is defined then we are updating existing project details
    // else adding new project details
    if (project) {
      // Convert the startDate and endDate from Unix timestamps to Day.js objects
      const startDate = project.startDate ? dayjs.unix(project.startDate) : null
      const endDate = project.endDate ? dayjs.unix(project.endDate) : null

      form.setFieldsValue({ ...project, startDate, endDate })
    } else {
      form.setFieldsValue(initialFormState)
    }
  }

  // Handle the click event for adding new project
  const handleAddProjectClick = () => {
    initiateValues()
    setAddProjectMode((prevMode) => !prevMode)
    setSelectedProject(null)
  }

  // Handle adding new project to the user's project list
  const handleAddNewProject = async () => {
    setLoading(true)
    const userId = localStorage.getItem('id')
    try {
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      // Convert the startDate and endDate to Unix timestamps
      const startDate = dayjs(formValues.startDate).unix()
      const endDate = dayjs(formValues.endDate).unix()
      const formData = {
        ...formValues,
        startDate,
        endDate,
      }
      // Make an API call to add new project to user's projects list
      const res = await addProjectDetailsAPI(userId, { ...formData })
      // if API call is successful, dispatch the addProject action to update the Redux store
      if (!res.status) {
        dispatch(addProject(res))
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
    setAddProjectMode(false)
  }

  // Handle the cancel button click event in the add project form
  const handleCancelProjectClick = () => {
    initiateValues()
    setAddProjectMode(false)
  }

  // Handle deleting an project entry from the user's projects list
  const deleteProjectDetails = async (projectId) => {
    const userId = localStorage.getItem('id')
    try {
      // Make an API call to delete project from user's projects list
      const res = await deleteProjectDetailsAPI(userId, { projectId })
      // if API call is successful, dispatch the removeProject action to update the Redux store
      if (!res.status) {
        dispatch(removeProject(projectId))
      }
    } catch (e) {
      console.error(e)
    }
  }
  // Handle the click event for editing an project entry
  const handleEditProjectClick = (project) => {
    setSelectedProject(project)
    setAddProjectMode(false)
  }

  // Handle updating an existing project entry in the user's projects list
  const handleEditProject = async () => {
    setLoading(true)
    const userId = localStorage.getItem('id')
    try {
      // Validate the form fields and obtain the form values
      const formValues = await form.validateFields()
      const startDate = formValues.startDate
        ? dayjs(formValues.startDate).unix()
        : null
      const endDate = formValues.endDate
        ? dayjs(formValues.endDate).unix()
        : null
      const formData = {
        ...formValues,
        projectId: selectedProject._id,
        startDate,
        endDate,
      }
      // Make an API call to add new project to user's projects list
      const res = await updateProjectDetailsAPI(userId, { ...formData })
      // if API call is successful, dispatch the updateProject action to update the Redux store
      if (!res.status) {
        dispatch(updateProject(res))
      }
    } catch (e) {
      console.error(e)
    }
    setSelectedProject(null)
    setLoading(false)
  }

  const handleCancelEditProject = () => {
    initiateValues()
    setSelectedProject(null)
  }

  // Function to render the user's projects list
  const renderProject = () => {
    if (userProjectsList.projects.length === 0) {
      return <Paragraph>No project information available.</Paragraph>
    }

    return (
      <List
        itemLayout='vertical'
        dataSource={userProjectsList.projects}
        renderItem={(project) => {
          // if an entry is selected for editing then display edit form for that entry
          // else display the entry as a list item
          if (selectedProject && selectedProject._id === project._id) {
            return renderProjectForm()
          } else {
            const startDate = project.startDate
              ? dayjs.unix(project.startDate).format('MMM YYYY')
              : null
            const endDate = project.endDate
              ? dayjs.unix(project.endDate).format('MMM YYYY')
              : null

            return (
              <Item>
                <Item.Meta
                  title={
                    <Button
                      type='link'
                      href={project.url || null}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ paddingLeft: 0 }}
                    >
                      <Paragraph className='user-details-list--header'>
                        {project.title} {project.url && <LinkOutlined />}
                      </Paragraph>
                    </Button>
                  }
                  description={
                    <>
                      {startDate && (
                        <Paragraph className='user-details-list--date'>
                          {startDate} - {endDate || 'current'}
                        </Paragraph>
                      )}
                      <Paragraph className='user-details-list--content content-description'>
                        {project.description}
                      </Paragraph>
                    </>
                  }
                />
                <Button
                  className='user-details-list--actions'
                  danger
                  onClick={() => deleteProjectDetails(project._id)}
                >
                  <DeleteOutlined />
                </Button>
                <Button
                  className='user-details-list--actions'
                  type='primary'
                  ghost
                  onClick={() => handleEditProjectClick(project)}
                >
                  <EditOutlined />
                </Button>
              </Item>
            )
          }
        }}
      />
    )
  }

  // Function to render the project form used for adding or editing project entries
  const renderProjectForm = () => {
    return (
      <Form
        layout='vertical'
        className='user-details-list--form'
        onFinish={selectedProject ? handleEditProject : handleAddNewProject}
        form={form}
      >
        <Paragraph className='user-details-list--form-header'>
          {selectedProject ? 'Edit details' : 'Add new details'}
        </Paragraph>
        <Form.Item
          label='Title'
          name='title'
          rules={[
            { required: true, message: 'Please enter the name of the project' },
          ]}
        >
          <Input name='title' />
        </Form.Item>
        <Form.Item
          label='URL'
          name='url'
          rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
        >
          <Input name='url' />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Start Date' name='startDate'>
              <DatePicker
                name='startDate'
                picker='month'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='End Date' name='endDate'>
              <DatePicker
                name='endDate'
                picker='month'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Description' name='description'>
          <Input.TextArea name='description' rows={4} />
        </Form.Item>
        <Form.Item>
          <div className='user-right-card--button-container'>
            <Button
              className='user-right-card--cancel-btn'
              type='default'
              shape='round'
              onClick={
                selectedProject
                  ? handleCancelEditProject
                  : handleCancelProjectClick
              }
            >
              Cancel
            </Button>
            <Button
              className='user-right-card--save-btn'
              type='primary'
              shape='round'
              htmlType='submit'
              loading={loading}
            >
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }

  return (
    <Card
      className='user-profile-card'
      title='Projects'
      extra={
        <Button type='text' onClick={handleAddProjectClick}>
          <PlusOutlined />
        </Button>
      }
    >
      {addProjectMode && renderProjectForm()}
      {renderProject()}
    </Card>
  )
}

export default ProjectsCard
