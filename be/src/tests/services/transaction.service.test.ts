import { TransactionService } from '../../services/transaction.service'
import { ProductService } from '../../services/product.service'
import { CashService } from '../../services/cash.service'
import { PrismaClient } from '@prisma/client'
import { PurchaseInput, Transaction } from '../../interfaces/transaction.interface'
import { Product } from '../../interfaces/product.interface'
import { Cash } from '../../interfaces/cash.interface'

describe('TransactionService', () => {
  let transactionService: TransactionService
  let mockProductService: jest.Mocked<ProductService>
  let mockCashService: jest.Mocked<CashService>
  let mockPrismaClient: jest.Mocked<PrismaClient>

  beforeEach(() => {
    mockProductService = {
      getProductById: jest.fn(),
    } as unknown as jest.Mocked<ProductService>

    mockCashService = {
      getAllCashes: jest.fn(),
    } as unknown as jest.Mocked<CashService>

    mockPrismaClient = {
      $transaction: jest.fn(),
      transaction: {
        create: jest.fn(),
      },
      product: {
        update: jest.fn(),
      },
      cashInventory: {
        update: jest.fn(),
        findMany: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>

    transactionService = new TransactionService(
      mockProductService as ProductService,
      mockCashService as CashService
    )
  })

  describe('purchase', () => {
    const purchaseInput: PurchaseInput = {
      productId: 1,
      insertedCash: [
        { denomination: 5, type: 'COIN', quantity: 2 },
        { denomination: 1, type: 'COIN', quantity: 3 },
      ],
    }

    it('should successfully process a purchase', async () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        price: 10,
        stock: 5,
        imageName: 'product1.jpg',
        category: 'Category A',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockCashes: Cash[] = [
        { id: 1, type: 'COIN', denomination: 5, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, type: 'COIN', denomination: 1, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
      ]

      mockProductService.getProductById.mockResolvedValue(mockProduct)
      mockCashService.getAllCashes.mockResolvedValue(mockCashes)

      const mockTransaction: Transaction = {
        id: 1,
        productId: purchaseInput.productId,
        amountPaid: 13,
        changeGiven: 3,
        status: 'COMPLETED',
        createdAt: new Date(),
      }

      mockPrismaClient.$transaction.mockResolvedValue(mockTransaction)

      const result = await transactionService.purchase(purchaseInput)

      expect(result.transaction.amountPaid).toBe(13)
      expect(result.transaction.changeGiven).toBe(3)
      expect(result.transaction.status).toBe('COMPLETED')
      expect(result.change).toEqual([{ denomination: 1, quantity: 3, type: 'COIN' }])
    })

    it('should throw error for insufficient funds', async () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        price: 20,
        stock: 5,
        imageName: 'product1.jpg',
        category: 'Category A',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockCashes: Cash[] = [
        { id: 1, type: 'COIN', denomination: 5, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, type: 'COIN', denomination: 1, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
      ]

      mockProductService.getProductById.mockResolvedValue(mockProduct)
      mockCashService.getAllCashes.mockResolvedValue(mockCashes)

      const insufficientFundsInput: PurchaseInput = {
        productId: 1,
        insertedCash: [
          { denomination: 5, type: 'COIN', quantity: 2 },
        ],
      }

      await expect(transactionService.purchase(insufficientFundsInput))
        .rejects
        .toThrowError('Insufficient funds')

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1)
      expect(mockCashService.getAllCashes).toHaveBeenCalled()
    })

    it('should throw error when product is out of stock', async () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        price: 10,
        stock: 0,
        imageName: 'product1.jpg',
        category: 'Category A',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockCashes: Cash[] = [
        { id: 1, type: 'COIN', denomination: 5, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, type: 'COIN', denomination: 1, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
      ]

      mockProductService.getProductById.mockResolvedValue(mockProduct)
      mockCashService.getAllCashes.mockResolvedValue(mockCashes)

      await expect(transactionService.purchase(purchaseInput))
        .rejects
        .toThrowError('Product out of stock')

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1)
      expect(mockCashService.getAllCashes).toHaveBeenCalled()
    })

    it('should throw error for invalid cash data', async () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        price: 10,
        stock: 5,
        imageName: 'product1.jpg',
        category: 'Category A',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const invalidCashInput: PurchaseInput = {
        productId: 1,
        insertedCash: [
          { denomination: 10, type: 'COIN', quantity: 2 },
        ],
      }

      const mockCashes: Cash[] = [
        { id: 1, type: 'COIN', denomination: 5, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
      ]

      mockProductService.getProductById.mockResolvedValue(mockProduct)
      mockCashService.getAllCashes.mockResolvedValue(mockCashes)

      await expect(transactionService.purchase(invalidCashInput))
        .rejects
        .toThrowError('Invalid cash data')

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1)
      expect(mockCashService.getAllCashes).toHaveBeenCalled()
    })

  })
})
