import { Button, InputNumber, Modal, Table } from "antd"
import { useProduct } from "../hooks/useProduct"
import { useState } from "react"

const StockManagement: React.FC = () => {
  const { update: updateStock, isLoading, products } = useProduct()
  const [editValues, setEditValues] = useState<Record<number, number | undefined>>({})

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', render: (price: number) => `฿${price}` },
    {
      title: 'Stock',
      dataIndex: 'stock',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <InputNumber
            min={0}
            defaultValue={record.stock}
            onChange={(value) => setEditValues({ ...editValues, [record.id]: value || 0 })}
          />
          {editValues[record.id] !== undefined && editValues[record.id] !== record.stock && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Confirm Update',
                  content: `Update stock from ${record.stock} to ${editValues[record.id]}?`,
                  onOk: () => {
                    updateStock({ id: record.id, stock: editValues[record.id] })
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
      dataSource={products?.sort((a, b) => a.id - b.id)}
      rowKey="id"
      pagination={false}
      scroll={{ y: 400 }}
    />
  )
}

export default StockManagement
