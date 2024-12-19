import { CashInventory } from '@prisma/client'
import { BaseRepository } from '../interfaces/repository.interface'
import prismaClient from '../libraries/prisma'
import { Cash } from '../interfaces/cash.interface'

export class CashRepository implements BaseRepository<Cash> {
  public async findAll(): Promise<Cash[]> {
    const cashInventories = await prismaClient.cashInventory.findMany()
    return cashInventories.map((cash: CashInventory) => ({
      ...cash,
      denomination: Number(cash.denomination)
    }))
  }

  public async findById(id: number): Promise<Cash | null> {
    const cash = await prismaClient.cashInventory.findUnique({
      where: { id }
    })
    return cash ? {
      ...cash,
      denomination: Number(cash.denomination)
    } : null
  }

  public async updateById(id: number, data: Partial<Cash>): Promise<Cash | null> {
    const cash = await prismaClient.cashInventory.update({ where: { id }, data: data })
    return cash ? {
      ...cash,
      denomination: Number(cash.denomination)
    } : null
  }
}


