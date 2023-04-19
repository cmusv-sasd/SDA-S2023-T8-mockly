import { Modal, Typography, Button, Space } from 'antd'

const { Paragraph } = Typography

const IntroModal = ({ isOpen, setOpen, setRun }) => {
  const handleLaunch = () => {
    setRun(true)
    setOpen(false)
  }

  return (
    <Modal
      open={isOpen}
      width={700}
      footer={null}
      onCancel={() => setOpen(false)}
    >
      <div className='d-flex flex-column justify-content-center'>
        <Paragraph
          className='text-center'
          style={{ fontSize: '30px', fontWeight: 700, marginBottom: '16px' }}
        >
          Welcome to Mockly!
        </Paragraph>
        <Paragraph
          className='text-center'
          style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}
        >
          Mockly solves your interview problems.
        </Paragraph>
        <Paragraph
          className='text-center'
          style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}
        >
          Schedule practice interviews at your leisure
        </Paragraph>
        <Paragraph className='text-center'>
          Want to learn how to use Mockly? Launch the interactive tutorial
          below!
        </Paragraph>
      </div>
      <div className='d-flex justify-content-center'>
        <Space align='center'>
          <Button type='primary' onClick={handleLaunch}>
            Launch
          </Button>
          <Button onClick={() => setOpen(false)}>No thanks</Button>
        </Space>
      </div>
    </Modal>
  )
}

export default IntroModal
