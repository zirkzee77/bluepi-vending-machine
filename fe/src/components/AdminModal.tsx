import { Modal, Tabs } from 'antd'
import StockManagement from './StockManagement'
import CashManagement from './CashManagement'

interface AdminModalProps {
  open: boolean
  onClose: () => void
}

const AdminModal: React.FC<AdminModalProps> = ({ open, onClose }) => (
  <Modal
    title="Admin Panel"
    open={open}
    onCancel={onClose}
    width={800}
    footer={null}
    destroyOnClose
  >
    <Tabs
      items={[
        {
          key: 'stock',
          label: 'Stock Management',
          children: <StockManagement />
        },
        {
          key: 'cash',
          label: 'Cash Management',
          children: <CashManagement />
        }
      ]}
    />
  </Modal>
)

export default AdminModal
