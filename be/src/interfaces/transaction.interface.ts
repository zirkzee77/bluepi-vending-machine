export interface Transaction {
  id: number
  productId: number
  amountPaid: number
  changeGiven: number
  status: string
  createdAt: Date
}

interface CashInput {
  denomination: number
  type: 'COIN' | 'BANKNOTE'
  quantity: number
}

export interface ChangeDetail {
  denomination: number
  type: 'COIN' | 'BANKNOTE'
  quantity: number
}

export interface PurchaseOutput {
  transaction: Transaction
  change: ChangeDetail[]
}

export interface PurchaseInput {
  productId: number
  insertedCash: CashInput[]
}

export interface ITransactionService {
  purchase(input: PurchaseInput): Promise<PurchaseOutput>
}

