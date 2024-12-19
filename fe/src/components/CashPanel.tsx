import styles from '../styles.module.css'
import { Button, Typography } from 'antd'
import CashInput from './CashInput'
import { CashType } from '../hooks/useVendingMachine'

interface CashPanelProps {
  totalAmount: number
  onAddCash: (denomination: number, type: CashType) => void
  onReturnCash: () => void
}

const CashPanel = ({ totalAmount, onAddCash, onReturnCash }: CashPanelProps) => {
  return (
    <div className={styles['cash-panel']}>
      <Typography>{`Total money: ฿${totalAmount}`}</Typography>
      <CashInput onAddCash={onAddCash} />
      <Button style={{ width: '200px' }} onClick={() => onReturnCash()}>Return your money</Button>
    </div>
  )
}

export default CashPanel
