import { ClusterOutlined, ForkOutlined, DatabaseOutlined, CodeOutlined, CodepenOutlined, CommentOutlined } from '@ant-design/icons'

const fieldMapping = {
  DATA_STRUCTURES_ALGORITHMS: { string: 'Data Structures and Algorithms', icon: <ClusterOutlined style={{ fontSize: 30 }} /> },
  SYSTEM_DESIGN: { string: 'System Design', icon: <ForkOutlined style={{ fontSize: 30 }} /> },
  DATA_SCIENCE: { string: 'Data Design', icon: <DatabaseOutlined style={{ fontSize: 30 }} /> },
  FRONTEND: { string: 'Frontend', icon: <CodeOutlined style={{ fontSize: 30 }} /> },
  BACKEND: { string: 'Backend', icon:<CodepenOutlined style={{ fontSize: 30 }} /> },
  BEHAVIORAL: { string: 'Behavioral', icon: <CommentOutlined style={{ fontSize: 30 }} /> },
}

export { fieldMapping }