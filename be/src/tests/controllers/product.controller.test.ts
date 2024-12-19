import { Request, Response } from 'express'
import { ProductController } from '../../controllers/product.controller'
import { ProductService } from '../../services/product.service'

describe('ProductController', () => {
  let productController: ProductController
  let mockProductService: ProductService
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as Partial<Response>

    mockProductService = {
      getAllProducts: jest.fn(),
      updateProductById: jest.fn()
    } as unknown as ProductService

    productController = new ProductController(mockProductService)
  })

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100, stock: 10, createdAt: new Date(), updatedAt: new Date(), category: 'drinks', imageName: 'product_1.png' },
        { id: 2, name: 'Product 2', price: 200, stock: 20, createdAt: new Date(), updatedAt: new Date(), category: 'snack', imageName: 'product_2.png' }
      ]

      jest.spyOn(mockProductService, 'getAllProducts').mockImplementation(() => Promise.resolve(mockProducts))

      await productController.getAllProducts({} as Request, mockResponse as Response)

      expect(mockProductService.getAllProducts).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts)
    })

    it('should handle errors', async () => {
      jest.spyOn(mockProductService, 'getAllProducts').mockImplementation(() => Promise.reject(new Error('DB Error')))

      await productController.getAllProducts({} as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to get products: Error: DB Error' })
    })
  })

  describe('updateProductById', () => {
    it('should update product if correct payload is provided', async () => {
      const mockUpdatedProduct = { id: 2, name: 'Product 2', price: 200, stock: 20, createdAt: new Date(), updatedAt: new Date(), category: 'snack', imageName: 'product_2.png' }

      jest.spyOn(mockProductService, 'updateProductById').mockImplementation(() => Promise.resolve(mockUpdatedProduct))

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Updated Product 1', price: 150 }
      } as unknown as Request

      await productController.updateProductById(mockRequest, mockResponse as Response)

      expect(mockProductService.updateProductById).toHaveBeenCalledWith(1, { name: 'Updated Product 1', price: 150 })

      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedProduct)
    })

    it('should handle errors during update', async () => {
      jest.spyOn(mockProductService, 'updateProductById').mockImplementation(() => Promise.reject(new Error('Update failed')))

      const mockRequest = {
        params: { id: '1' },
        body: { name: 'Updated Product 1', price: 150 }
      } as unknown as Request

      await productController.updateProductById(mockRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' })
    })
  })
})
