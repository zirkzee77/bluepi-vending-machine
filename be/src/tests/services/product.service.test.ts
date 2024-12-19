import { ProductService } from '../../services/product.service'
import { ProductRepository } from '../../repositories/product.repository'
import { Product } from '../../interfaces/product.interface'
import { CreateParams } from 'src/interfaces/repository.interface'

describe('ProductService', () => {
  let productService: ProductService
  let mockProductRepository: jest.Mocked<ProductRepository>

  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>

    productService = new ProductService(mockProductRepository)
  })

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts: Product[] = [
        { id: 1, name: 'Product 1', price: 100, stock: 10, imageName: 'product1.jpg', category: 'Category A', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Product 2', price: 150, stock: 5, imageName: 'product2.jpg', category: 'Category B', createdAt: new Date(), updatedAt: new Date() },
      ]

      mockProductRepository.findAll.mockResolvedValue(mockProducts)

      const result = await productService.getAllProducts()

      expect(result).toEqual(mockProducts)
      expect(mockProductRepository.findAll).toHaveBeenCalled()
    })

    it('should handle errors when fetching products', async () => {
      const errorMessage = 'Error fetching products'
      mockProductRepository.findAll.mockRejectedValue(new Error(errorMessage))

      await expect(productService.getAllProducts()).rejects.toThrowError(new Error(errorMessage))
    })
  })

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const mockProduct: Product = { id: 1, name: 'Product 1', price: 100, stock: 10, imageName: 'product1.jpg', category: 'Category A', createdAt: new Date(), updatedAt: new Date() }

      mockProductRepository.findById.mockResolvedValue(mockProduct)

      const result = await productService.getProductById(1)

      expect(result).toEqual(mockProduct)
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1)
    })

    it('should throw an error when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null)

      await expect(productService.getProductById(999)).rejects.toThrowError('Product not found')

      expect(mockProductRepository.findById).toHaveBeenCalledWith(999)
    })
  })

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProductData: CreateParams<Product> = { name: 'New Product', price: 200, stock: 10, imageName: 'new-product.jpg', category: 'Category C' }
      const mockCreatedProduct: Product = { id: 3, ...newProductData, createdAt: new Date(), updatedAt: new Date() }

      mockProductRepository.create.mockResolvedValue(mockCreatedProduct)

      const result = await productService.createProduct(newProductData)

      expect(result).toEqual(mockCreatedProduct)
      expect(mockProductRepository.create).toHaveBeenCalledWith(newProductData)
    })

    it('should handle errors when creating a product', async () => {
      const errorMessage = 'Error creating product'
      const newProductData: CreateParams<Product> = { name: 'New Product', price: 200, stock: 10, imageName: 'new-product.jpg', category: 'Category C' }

      mockProductRepository.create.mockRejectedValue(new Error(errorMessage))

      await expect(productService.createProduct(newProductData)).rejects.toThrowError(new Error(errorMessage))
    })
  })

  describe('updateProductById', () => {
    it('should update a product by ID', async () => {
      const productId = 1
      const updatedData: Partial<Product> = { price: 120, stock: 8 }
      const mockUpdatedProduct: Product = { id: productId, name: 'Product 1', price: 120, stock: 8, imageName: 'product1.jpg', category: 'Category A', createdAt: new Date(), updatedAt: new Date() }

      mockProductRepository.findById.mockResolvedValue(mockUpdatedProduct)
      mockProductRepository.updateById.mockResolvedValue(mockUpdatedProduct)

      const result = await productService.updateProductById(productId, updatedData)

      expect(result).toEqual(mockUpdatedProduct)
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId)
      expect(mockProductRepository.updateById).toHaveBeenCalledWith(productId, updatedData)
    })

    it('should throw an error when product is not found during update', async () => {
      const productId = 999
      const updatedData: Partial<Product> = { price: 120, stock: 8 }

      mockProductRepository.findById.mockResolvedValue(null)

      await expect(productService.updateProductById(productId, updatedData)).rejects.toThrowError(new Error('Product not found'))
    })
  })

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      const productId = 1

      mockProductRepository.findById.mockResolvedValue({ id: productId, name: 'Product 1', price: 100, stock: 10, imageName: 'product1.jpg', category: 'Category A', createdAt: new Date(), updatedAt: new Date() })
      mockProductRepository.deleteById.mockResolvedValue()

      await productService.deleteProduct(productId)

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId)
      expect(mockProductRepository.deleteById).toHaveBeenCalledWith(productId)
    })

    it('should throw an error when product is not found during deletion', async () => {
      const productId = 999

      mockProductRepository.findById.mockResolvedValue(null)

      await expect(productService.deleteProduct(productId)).rejects.toThrowError(new Error('Product not found'))
    })
  })
})
