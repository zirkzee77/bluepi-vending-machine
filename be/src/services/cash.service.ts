import { Cash, ICashService } from "../interfaces/cash.interface";
import { CashRepository } from "../repositories/cash.repository";

export class CashService implements ICashService {
  constructor(
    private readonly cashRepository: CashRepository
  ) { }

  public getAllCashes(): Promise<Cash[]> {
    return this.cashRepository.findAll()
  }

  public async getCashById(id: number): Promise<Cash | null> {
    const product = await this.cashRepository.findById(id)
    if (!product) {
      throw new Error('Product not found')
    }
    return product
  }

  public async updateCashById(id: number, data: Partial<Cash>): Promise<Cash | null> {
    await this.getCashById(id)
    return this.cashRepository.updateById(id, data)
  }
}
