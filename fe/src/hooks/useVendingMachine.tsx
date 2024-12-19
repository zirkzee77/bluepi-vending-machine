import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import fetchApi from '../utils/fetch'
import { PurchaseOutput } from '../interfaces/transaction.interface'
import { Modal, Typography } from 'antd'

export type CashType = 'COIN' | 'BANKNOTE'
interface InsertedCash {
  denomination: number
  type: CashType
  quantity: number
}

export const useVendingMachine = () => {
  const [insertedCash, setInsertedCash] = useState<InsertedCash[]>([])
  const queryClient = useQueryClient()
  const totalAmount = useMemo(() => {
    return insertedCash.reduce((sum, { denomination, quantity }) =>
      sum + (denomination * quantity), 0
    )
  }, [insertedCash])

  const addCash = (denomination: number, type: CashType) => {
    setInsertedCash(prev => {
      const existing = prev.find(cash => cash.denomination === denomination)

      if (existing) {
        return prev.map(cash =>
          cash.denomination === denomination
            ? { ...cash, quantity: cash.quantity + 1 }
            : cash
        )
      }

      return [...prev, { denomination, type, quantity: 1 }]
    })
  }

  const { mutate: purchase } = useMutation({
    mutationFn: async (productId: number) => {
      const response = await fetchApi('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          insertedCash
        })
      })

      return response
    },
    onSuccess: async (data: PurchaseOutput) => {
      if (data.change.length > 0) {
        Modal.success({
          title: 'Collect Your Change',
          content:
            (<>
              {data.change.sort((a, b) => a.denomination - b.denomination).map(item =>
                <>
                  <Typography>
                    {`${item.type}: ฿${item.denomination} x ${item.quantity}`}
                  </Typography>
                  <br />
                </>
              )
              }
            </>)
        })
      } else {
        Modal.success({
          title: 'Thank you for your purchase'
        })
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['products'] }),
        queryClient.invalidateQueries({ queryKey: ['cash-inventory'] })
      ])
      setInsertedCash([])
    },
    onError: (error: Error) => {
      console.log('error: ', error.name)
      Modal.error({
        title: 'Purchase Failed',
        content: error.message || 'Unable to complete purchase'
      })
    }
  })

  const returnCash = () => {
    Modal.success({
      title: 'Returning your money back',
      content:
        (<>
          {insertedCash.sort((a, b) => a.denomination - b.denomination).map(item =>
            <>
              <Typography>
                {`${item.type}: ฿${item.denomination} x ${item.quantity}`}
              </Typography>
              <br />
            </>
          )
          }
        </>)
    })
    setInsertedCash([])
  }

  return {
    insertedCash,
    totalAmount,
    addCash,
    returnCash,
    purchase
  }
}
