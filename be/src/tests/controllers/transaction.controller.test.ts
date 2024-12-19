import { Request, Response } from 'express'
import { TransactionController } from '../../controllers/transaction.controller'
import { TransactionService } from '../../services/transaction.service'
import { ChangeDetail, PurchaseOutput } from 'src/interfaces/transaction.interface'

describe('TransactionController', () => {
  let transactionController: TransactionController
  let mockTransactionService: TransactionService
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>

    mockTransactionService = {
      purchase: jest.fn(),
    } as unknown as TransactionService

    transactionController = new TransactionController(mockTransactionService)
  })

  describe('purchase', () => {
    it('should return the purchase output when the purchase is successful', async () => {
      const mockTransaction = {
        id: 123,
        productId: 456,
        amountPaid: 500,
        changeGiven: 100,
        status: 'success',
        createdAt: new Date(),
      }

      const mockChange: ChangeDetail[] = [
        { denomination: 100, type: 'BANKNOTE', quantity: 1 },
        { denomination: 20, type: 'COIN', quantity: 1 },
        { denomination: 10, type: 'COIN', quantity: 2 },
      ]

      const mockPurchaseOutput: PurchaseOutput = {
        transaction: mockTransaction,
        change: mockChange,
      }

      const mockRequest = {
        body: { itemId: 456, amountPaid: 500 },
      } as Request

      jest.spyOn(mockTransactionService, 'purchase').mockResolvedValue(mockPurchaseOutput)

      await transactionController.purchase(mockRequest, mockResponse as Response)

      expect(mockTransactionService.purchase).toHaveBeenCalledWith({
        itemId: 456,
        amountPaid: 500,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(mockPurchaseOutput)
    })

    it('should handle errors and return a 400 status when an error is thrown', async () => {
      const mockRequest = {
        body: { itemId: 456, amountPaid: 500 },
      } as Request

      const error = new Error('Insufficient funds')
      jest.spyOn(mockTransactionService, 'purchase').mockRejectedValue(error)

      await transactionController.purchase(mockRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Insufficient funds',
      })
    })

    it('should return a 500 status for unexpected errors (non-Error instances)', async () => {
      const mockRequest = {
        body: { itemId: 456, amountPaid: 500 },
      } as Request

      const unexpectedError = { message: 'Unexpected server issue', code: 500 }
      jest.spyOn(mockTransactionService, 'purchase').mockRejectedValue(unexpectedError)

      await transactionController.purchase(mockRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to purchase',
      })
    })
  })
})
