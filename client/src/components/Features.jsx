import React from 'react'
import { Card } from 'antd'
import {
  UserOutlined,
  SyncOutlined,
  DollarCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons'

const { Meta } = Card

const FeatureCard = ({ icon, title, description }) => (
  <Card
    style={{
      marginBottom: '16px',
      borderRadius: '30px',
    }}
    bodyStyle={{ padding: '16px' }}
    hoverable
  >
    <Meta avatar={icon} title={title} description={description} />
  </Card>
)

const Features = () => {
  const features = [
    {
      title: 'Personal Profiles',
      description:
        'Easily create and manage your personal profile with education details, work experience, and many more.',
      icon: <UserOutlined />,
    },
    {
      title: 'Smart Matching',
      description:
        'Get paired with other users based on preferences such as schedules, background, experience, and topics of interest.',
      icon: <SyncOutlined />,
    },
    {
      title: 'Payments',
      description:
        'Enjoy a hassle-free payment experience with multiple options like credit card and PayPal.',
      icon: <DollarCircleOutlined />,
    },
    {
      title: 'Feedback System',
      description:
        'Share and receive valuable feedback from interviews to gain insights into your performance and professionalism.',
      icon: <MessageOutlined />,
    },
  ]

  return (
    <div style={{ padding: '20px' }}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

export default Features
