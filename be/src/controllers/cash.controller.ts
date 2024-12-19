import { Request, Response } from 'express'
import { CashService } from 'src/services/cash.service'

export class CashController {
  constructor(
    private readonly cashService: CashService
  ) { }


  public async getAllCashes(_: Request, res: Response): Promise<void> {
    try {

      const cashes = await this.cashService.getAllCashes()
      res.json(cashes)
    } catch (error) {
      res.status(500).json({ error: `Failed to get cashes: ${error}` })
    }
  }

  public async updateCashById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const product = await this.cashService.updateCashById(id, req.body)
      res.json(product)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to update cash' })
      }
    }
  }

}
