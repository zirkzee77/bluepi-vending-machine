import { Product } from '../interfaces/product.interface'
import { Product as PrismaProduct } from '@prisma/client'
import { BaseRepository, CreateParams } from '../interfaces/repository.interface'
import prismaClient from '../libraries/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export class ProductRepository implements BaseRepository<Product> {
  public async findAll(): Promise<Product[]> {
    const products = await prismaClient.product.findMany()
    return products.map((product: PrismaProduct) => ({
      ...product,
      price: Number(product.price)
    }))
  }

  public async findById(id: number): Promise<Product | null> {
    const product = await prismaClient.product.findUnique({
      where: { id }
    })
    return product ? {
      ...product,
      price: Number(product.price)
    } : null
  }

  public async create(data: CreateParams<Product>): Promise<Product> {
    const createResult = await prismaClient.product.create({ data: { ...data, price: this.parseDecimal(data.price) } })
    return {
      ...createResult,
      price: Number(createResult.price)
    }
  }

  public async updateById(id: number, data: Partial<Product>): Promise<Product> {
    const updateResult = await prismaClient.product.update({
      where: { id },
      data
    })
    return {
      ...updateResult,
      price: Number(updateResult.price)
    }
  }

  public async deleteById(id: number): Promise<void> {
    await prismaClient.product.delete({
      where: { id }
    })
  }

  private parseDecimal(number: number): Decimal {
    return new Decimal(number)
  }
}
