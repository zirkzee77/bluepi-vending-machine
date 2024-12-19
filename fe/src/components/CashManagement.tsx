import { Button, InputNumber, Modal, Table } from "antd"
import { useCash } from "../hooks/useCash"
import { useState } from "react"

const CashManagement: React.FC = () => {
  const { isLoading, inventory: cashInventory, updateCash } = useCash()
  const [editValues, setEditValues] = useState<Record<number, number | undefined>>({})
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type: string) => type === 'COIN' ? 'Coin' : 'Banknote'
    },
    {
      title: 'Denomination',
      dataIndex: 'denomination',
      render: (denomination: number) => `฿${denomination}`
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <InputNumber
            min={0}
            defaultValue={record.quantity}
            onChange={(value) => setEditValues({ ...editValues, [record.id]: value || 0 })}
          />
          {editValues[record.id] !== undefined && editValues[record.id] !== record.quantity && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Confirm Update',
                  content: `Update quantity from ${record.quantity} to ${editValues[record.id]}?`,
                  onOk: () => {
                    updateCash({ id: record.id, quantity: editValues[record.id] })
                    setEditValues({ ...editValues, [record.id]: undefined })
                  }
                })
              }}
            >
              Update
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={cashInventory?.sort((a, b) => a.denomination - b.denomination)}
      rowKey="id"
      pagination={false}
      scroll={{ y: 400 }}
    />
  )
}

export default CashManagement
