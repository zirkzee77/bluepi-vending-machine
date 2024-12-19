export interface Cash {
  id: number
  type: string
  quantity: number
  denomination: number
  createdAt: Date
  updatedAt: Date
}


export interface ICashService {
  getAllCashes(): Promise<Cash[]>
  getCashById(id: number): Promise<Cash | null>
  updateCashById(id: number, data: Partial<Cash>): Promise<Cash | null>
}

