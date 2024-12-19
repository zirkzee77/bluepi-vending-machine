import { Request, Response } from 'express'
import { TransactionService } from 'src/services/transaction.service'

export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService
  ) { }

  public async purchase(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOutput = await this.transactionService.purchase(req.body)
      res.status(201).json(purchaseOutput)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to purchase' })
      }
    }
  }
}
