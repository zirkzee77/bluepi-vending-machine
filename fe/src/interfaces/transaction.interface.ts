export interface Transaction {
  id: number
  productId: number
  amountPaid: number
  changeGiven: number
  status: string
}

interface ChangeDetail {
  denomination: number
  type: 'COIN' | 'BANKNOTE'
  quantity: number
}

export interface PurchaseOutput {
  transaction: Transaction
  change: ChangeDetail[]
}
