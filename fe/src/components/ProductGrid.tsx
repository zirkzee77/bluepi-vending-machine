import { Col, Row } from 'antd'
import styles from '../styles.module.css'
import { Product as IProduct } from '../interfaces/product.interface'
import Product from './Product'

interface ProductGridProps {
  products: IProduct[],
  onPurchase: (productId: number) => void
}

const ProductGrid = ({ products, onPurchase }: ProductGridProps) => {
  return (
    <div className={styles['product-grid']}>
      <Row gutter={[16, 16]}>{products.sort((a, b) => a.id - b.id).map((product) =>
        <Col xs={12} md={8} xl={6} key={`col ${product.id}`} >
          <Product key={product.id} product={product} onPurchase={onPurchase} />
        </Col>)}
      </Row>
    </div>
  )
}

export default ProductGrid 
