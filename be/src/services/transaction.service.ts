import { ChangeDetail, ITransactionService, PurchaseInput, PurchaseOutput } from '../interfaces/transaction.interface'
import { ProductService } from './product.service'
import { CashService } from './cash.service'
import prismaClient from '../libraries/prisma'

export class TransactionService implements ITransactionService {
  constructor(
    private readonly productService: ProductService,
    private readonly cashService: CashService
  ) { }

  async purchase(data: PurchaseInput): Promise<PurchaseOutput> {
    const product = await this.productService.getProductById(data.productId);
    const cashes = await this.cashService.getAllCashes();
    const cashesDenominationIdMap = new Map(cashes.map(({ id, denomination }) => [denomination, id]));

    const totalInserted = data.insertedCash.reduce((sum, cash) =>
      sum + (cash.denomination * cash.quantity), 0
    );

    if (totalInserted < product.price) {
      throw new Error('Insufficient funds');
    }

    if (product.stock <= 0) {
      throw new Error('Product out of stock');
    }

    const changeAmount = totalInserted - Number(product.price);

    return prismaClient.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          productId: data.productId,
          amountPaid: totalInserted,
          changeGiven: changeAmount,
          status: 'COMPLETED'
        }
      });

      await tx.product.update({
        where: { id: data.productId },
        data: {
          stock: { decrement: 1 }
        }
      });

      for (const cash of data.insertedCash) {
        const dbCash = cashesDenominationIdMap.get(cash.denomination);
        if (!dbCash) {
          throw new Error('Invalid cash data');
        }
        await tx.cashInventory.update({
          where: { id: dbCash },
          data: {
            quantity: { increment: cash.quantity }
          }
        });
      }

      const changeToReturn: ChangeDetail[] = [];

      if (changeAmount > 0) {
        const availableCash = await tx.cashInventory.findMany({
          orderBy: {
            denomination: 'desc'
          }
        });

        let remainingChange = changeAmount;

        for (const cash of availableCash) {
          if (remainingChange <= 0) break;

          const count = Math.min(
            Math.floor(remainingChange / Number(cash.denomination)),
            cash.quantity
          );

          if (count > 0) {
            changeToReturn.push({
              denomination: Number(cash.denomination),
              quantity: count,
              type: cash.type as "COIN" | "BANKNOTE"
            });
            remainingChange -= Number(cash.denomination) * count;

            await tx.cashInventory.update({
              where: { id: cash.id },
              data: {
                quantity: { decrement: count }
              }
            });
          }
        }

        if (remainingChange > 0) {
          throw new Error('Unable to provide exact change');
        }
      }

      return {
        transaction: {
          ...transaction,
          amountPaid: Number(transaction.amountPaid),
          changeGiven: Number(transaction.changeGiven)
        },
        change: changeToReturn
      };
    });
  }
}
