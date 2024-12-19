import { IProductService, Product } from '../interfaces/product.interface'
import { CreateParams } from '../interfaces/repository.interface'
import { ProductRepository } from '../repositories/product.repository'

export class ProductService implements IProductService {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }


  public async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll()
  }

  public async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error('Product not found')
    }
    return product
  }

  public async createProduct(data: CreateParams<Product>): Promise<Product> {
    return this.productRepository.create(data)
  }

  public async updateProductById(id: number, data: Partial<Product>): Promise<Product> {
    await this.getProductById(id)
    return this.productRepository.updateById(id, data)
  }

  public async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id)
    return this.productRepository.deleteById(id)
  }
}
