import { CashService } from "../../services/cash.service"
import { CashRepository } from "../../repositories/cash.repository"
import { Cash } from "../../interfaces/cash.interface"

describe('CashService', () => {
  let cashService: CashService
  let mockCashRepository: jest.Mocked<CashRepository>

  beforeEach(() => {
    mockCashRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateById: jest.fn(),
    } as unknown as jest.Mocked<CashRepository>

    cashService = new CashService(mockCashRepository)
  })

  describe('getAllCashes', () => {
    it('should return all cashes', async () => {
      const mockCashes: Cash[] = [
        { id: 1, type: 'COIN', denomination: 1, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, type: 'BANKNOTE', denomination: 5, quantity: 10, createdAt: new Date(), updatedAt: new Date() }
      ]

      mockCashRepository.findAll.mockResolvedValue(mockCashes)

      const result = await cashService.getAllCashes()

      expect(result).toEqual(mockCashes)
      expect(mockCashRepository.findAll).toHaveBeenCalled()
    })

    it('should handle errors when fetching cashes', async () => {
      const errorMessage = 'Error fetching cashes'
      mockCashRepository.findAll.mockRejectedValue(new Error(errorMessage))

      await expect(cashService.getAllCashes()).rejects.toThrowError(new Error(errorMessage))
    })
  })

  describe('getCashById', () => {
    it('should return a cash item by ID', async () => {
      const mockCash: Cash = { id: 1, type: 'COIN', quantity: 10, denomination: 1, createdAt: new Date(), updatedAt: new Date() }

      mockCashRepository.findById.mockResolvedValue(mockCash)

      const result = await cashService.getCashById(1)

      expect(result).toEqual(mockCash)
      expect(mockCashRepository.findById).toHaveBeenCalledWith(1)
    })

    it('should throw an error when cash is not found', async () => {
      mockCashRepository.findById.mockResolvedValue(null)

      await expect(cashService.getCashById(999)).rejects.toThrowError('Product not found')

      expect(mockCashRepository.findById).toHaveBeenCalledWith(999)
    })
  })

  describe('updateCashById', () => {
    it('should update a cash item by ID', async () => {
      const cashId = 1
      const updatedData: Partial<Cash> = { denomination: 10 }
      const mockUpdatedCash: Cash = { id: cashId, type: 'COIN', denomination: 10, quantity: 10, createdAt: new Date(), updatedAt: new Date() }

      mockCashRepository.findById.mockResolvedValue(mockUpdatedCash)
      mockCashRepository.updateById.mockResolvedValue(mockUpdatedCash)

      const result = await cashService.updateCashById(cashId, updatedData)

      expect(result).toEqual(mockUpdatedCash)
      expect(mockCashRepository.findById).toHaveBeenCalledWith(cashId)
      expect(mockCashRepository.updateById).toHaveBeenCalledWith(cashId, updatedData)
    })

    it('should throw an error when cash is not found during update', async () => {
      const cashId = 999
      const updatedData: Partial<Cash> = { denomination: 10 }

      mockCashRepository.findById.mockResolvedValue(null)

      await expect(cashService.updateCashById(cashId, updatedData)).rejects.toThrowError('Product not found')

      expect(mockCashRepository.findById).toHaveBeenCalledWith(cashId)
    })
  })
})
