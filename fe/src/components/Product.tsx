import { Button, Image, Typography } from 'antd'
import styles from '../styles.module.css'
import { Product as IProduct } from '../interfaces/product.interface'
import getMediaUrl from '../utils/media'

interface ProductProps {
  product: IProduct,
  onPurchase: (productId: number) => void
}

const Product = ({ product, onPurchase }: ProductProps) => {
  const { name, stock, price, imageName, id } = product
  const disabled = stock === 0
  const imgUrl = getMediaUrl(imageName)
  return (
    <div className={styles['product']}>
      <Typography>{name}</Typography>
      <Image width={150} height={150} src={imgUrl} />
      <Typography>{`฿${price}`}</Typography>
      <Typography>{`Stock: ${stock}`}</Typography>
      <Button disabled={disabled} style={{ backgroundColor: disabled ? 'white' : '#ADD8E6' }} onClick={() => onPurchase(id)}>Purchase</Button>
    </div>
  )
}

export default Product
