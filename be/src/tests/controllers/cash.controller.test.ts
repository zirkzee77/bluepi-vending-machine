import { Request, Response } from 'express'
import { CashController } from '../../controllers/cash.controller'
import { CashService } from '../../services/cash.service'

describe('CashController', () => {
  let cashController: CashController
  let mockCashService: CashService
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as Partial<Response>

    mockCashService = {
      getAllCashes: jest.fn(),
      updateCashById: jest.fn()
    } as unknown as CashService

    cashController = new CashController(mockCashService)
  })

  describe('getAllCashes', () => {
    it('should return all cash inventory', async () => {
      const mockCashInventory = [
        { id: 1, denomination: 1, type: 'COIN', quantity: 100, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, denomination: 5, type: 'COIN', quantity: 100, createdAt: new Date(), updatedAt: new Date() }
      ]

      jest.spyOn(mockCashService, 'getAllCashes').mockImplementation(() => Promise.resolve(mockCashInventory))

      await cashController.getAllCashes({} as Request, mockResponse as Response)

      expect(mockCashService.getAllCashes).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith(mockCashInventory)
    })

    it('should handle errors', async () => {
      jest.spyOn(mockCashService, 'getAllCashes').mockImplementation(() => Promise.reject(new Error('DB Error')))

      await cashController.getAllCashes({} as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to get cashes: Error: DB Error' })
    })
  })

  describe('updateCashById', () => {
    it('should update cash if correct payload is provided', async () => {
      const mockUpdatedCash = { id: 1, denomination: 1, type: 'COIN', quantity: 150, createdAt: new Date(), updatedAt: new Date() }

      jest.spyOn(mockCashService, 'updateCashById').mockImplementation(() => Promise.resolve(mockUpdatedCash))

      const mockRequest = {
        params: { id: '1' },
        body: { quantity: 150 }
      } as unknown as Request

      await cashController.updateCashById(mockRequest, mockResponse as Response)

      expect(mockCashService.updateCashById).toHaveBeenCalledWith(1, { quantity: 150 })

      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedCash)
    })

    it('should handle errors during update', async () => {
      jest.spyOn(mockCashService, 'updateCashById').mockImplementation(() => Promise.reject(new Error('Update failed')))

      const mockRequest = {
        params: { id: '1' },
        body: { quantity: 150 }
      } as unknown as Request

      await cashController.updateCashById(mockRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' })
    })
  })
})
