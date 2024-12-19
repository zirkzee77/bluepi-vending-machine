import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from 'antd'
import fetchApi from '../utils/fetch'

interface CashInventory {
  id: number
  denomination: number
  type: 'COIN' | 'BANKNOTE'
  quantity: number
}

export const useCash = () => {
  const queryClient = useQueryClient()

  const { data: inventory, isLoading } = useQuery<CashInventory[]>({
    queryKey: ['cash-inventory'],
    queryFn: () => fetchApi('/cash-inventory'),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  const { mutate: update } = useMutation({
    mutationFn: (data: Partial<CashInventory>) =>
      fetchApi(`/cash-inventory/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-inventory'] })
      Modal.success({ title: 'Cash inventory updated' })
    },
    onError: (error: Error) => {
      Modal.error({ title: 'Update cash inventory failed', content: error.message })
    }
  })

  return {
    inventory,
    isLoading,
    updateCash: update
  }
}
