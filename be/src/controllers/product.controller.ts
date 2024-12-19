import { Request, Response } from 'express'
import { IProductService } from '../interfaces/product.interface'

export class ProductController {
  constructor(
    private readonly productService: IProductService
  ) { }


  public async getAllProducts(_: Request, res: Response): Promise<void> {
    try {

      const products = await this.productService.getAllProducts()
      res.json(products)
    } catch (error) {
      res.status(500).json({ error: `Failed to get products: ${error}` })
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const product = await this.productService.getProductById(id)
      res.json(product)
    } catch (error) {
      res.status(404).json({ error: 'Product not found' })
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body)
      res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' })
    }
  }

  public async updateProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const product = await this.productService.updateProductById(id, req.body)
      res.json(product)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to update product' })
      }
    }
  }
}
