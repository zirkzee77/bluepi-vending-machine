import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import fetchApi from '../utils/fetch'
import { Product } from '../interfaces/product.interface'
import { Modal } from 'antd'

export const useProduct = () => {
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => fetchApi('/products')
  })

  const { mutate: update } = useMutation({
    mutationFn: (data: Partial<Product>) =>
      fetchApi(`/products/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      Modal.success({ title: 'Updated product data' })
    },
    onError: (error: Error) => {
      Modal.error({ title: 'Failed to update product data', content: error.message })
    }
  })

  return {
    isLoading,
    products,
    update
  }
}
