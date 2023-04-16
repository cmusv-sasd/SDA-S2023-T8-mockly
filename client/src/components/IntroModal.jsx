import { Modal, Typography, Button, Space } from "antd"

const IntroModal = ({ isOpen, setOpen, setRun }) => {

  const handleLaunch = () => {
    setRun(true)
    setOpen(false)
  }

  return (
    <Modal
      open={isOpen}
      width={800}
      footer={null}>
      <Typography.Title>Welcome to Mockly!</Typography.Title>
      <Typography.Title level={3}>
        Mockly solves your interview problems. 
      </Typography.Title>
      <Typography.Title level={3}>
        Schedule and conduct practice interviews at your leisure so you can ace your next one.
      </Typography.Title>
      <Typography.Title level={5}>
        Want to learn how to use Mockly? Launch the interactive tutorial below!
      </Typography.Title>
      <div className="d-flex justify-content-center">
        <Space direction="vertical" align="center">
          <Button type="primary" onClick={handleLaunch}>Launch</Button>
          <Button onClick={() => setOpen(false)}>No thanks</Button>
        </Space>
      </div>
    </Modal>
  )
}

export default IntroModal