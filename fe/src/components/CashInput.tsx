import { Button } from 'antd'
import styles from '../styles.module.css'
import Config from '../utils/config'
import { CashType } from '../hooks/useVendingMachine'

interface CashInputProps {
  onAddCash: (denomination: number, type: CashType) => void
}

const CashInput = ({ onAddCash }: CashInputProps) => {
  return (
    <div className={styles['cash-input']}>
      {
        Config.CashConfig.COINS.map(({ denomination, color }) =>
          <Button key={denomination} shape={'circle'} style={{ backgroundColor: color }} className={styles['coin']} onClick={() => onAddCash(denomination, 'COIN')}>
            {`฿${denomination}`}
          </Button>
        )
      }
      {
        Config.CashConfig.NOTES.map(({ denomination, color }) =>
          <Button key={denomination} style={{ backgroundColor: color }} className={styles['note']} onClick={() => onAddCash(denomination, 'BANKNOTE')}>
            {`฿${denomination}`}
          </Button>)
      }
    </div>
  )
}

export default CashInput
