import { useMutation, useQueryClient } from '@tanstack/react-query'
import fetchApi from '../utils/fetch'

interface PurchaseParams {
  productId: number
  insertedCash: {
    denomination: number
    type: 'COIN' | 'BANKNOTE'
    quantity: number
  }[]
}

export const useTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: PurchaseParams) =>
      fetchApi('/transactions', {
        method: 'POST',
        body: JSON.stringify(params)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}
