import { CreateParams } from "./repository.interface"

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  imageName: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface IProductService {
  getAllProducts(): Promise<Product[]>
  getProductById(id: number): Promise<Product | null>
  createProduct(params: CreateParams<Product>): Promise<Product | null>
  updateProductById(id: number, data: Partial<Product>): Promise<Product | null>
}

