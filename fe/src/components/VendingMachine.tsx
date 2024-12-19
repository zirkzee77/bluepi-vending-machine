import { Button, Spin, Typography } from 'antd'
import styles from '../styles.module.css'
import ProductGrid from './ProductGrid'
import CashPanel from './CashPanel'
import { useProduct } from '../hooks/useProduct'
import { useVendingMachine } from '../hooks/useVendingMachine'
import { useState } from 'react'
import AdminModal from './AdminModal'

const VendingMahine = () => {
  const [openAdminModal, setOpenAdminModal] = useState<boolean>(false)
  const { products, isLoading: fetchingProducts } = useProduct()
  const { addCash, totalAmount, purchase, returnCash } = useVendingMachine()


  if (!products || fetchingProducts) return <Spin />

  return (
    <div className={styles['vending-machine']}>
      <div className={styles['header']}>
        <Typography.Title>Vending Machine</Typography.Title>
      </div>
      <Button onClick={() => setOpenAdminModal(true)}>Open admin panel</Button>
      <AdminModal open={openAdminModal} onClose={() => setOpenAdminModal(false)} />
      <ProductGrid products={products} onPurchase={purchase} />
      <CashPanel totalAmount={totalAmount} onAddCash={addCash} onReturnCash={returnCash} />
    </div>
  )
}

export default VendingMahine
