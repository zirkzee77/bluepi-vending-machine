import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingProducts = await prisma.product.count();
  const existingCashes = await prisma.cashInventory.count();
  const existingTransactions = await prisma.transaction.count();
  if (existingProducts === 0 && existingCashes === 0 && existingTransactions === 0) {
    const products = [
      { name: 'Coca Cola', price: 15, stock: 10, category: 'drinks', imageName: 'coke.png' },
      { name: 'Pepsi', price: 15, stock: 10, category: 'drinks', imageName: 'pepsi.png' },
      { name: 'Fanta', price: 15, stock: 10, category: 'drinks', imageName: 'fanta.png' },
      { name: 'Water', price: 10, stock: 15, category: 'drinks', imageName: 'water.png' },
      { name: 'Lays', price: 20, stock: 8, category: 'snacks', imageName: 'lays.png' },
      { name: 'Doritos', price: 20, stock: 8, category: 'snacks', imageName: 'doritos.png' },
      { name: 'Snickers', price: 15, stock: 12, category: 'snacks', imageName: 'snickers.png' },
      { name: 'KitKat', price: 15, stock: 12, category: 'snacks', imageName: 'kitkat.png' },
      { name: 'Oreo', price: 20, stock: 10, category: 'snacks', imageName: 'oreo.png' },
      { name: 'M&Ms', price: 25, stock: 8, category: 'snacks', imageName: 'mm.png' }
    ]
    await prisma.product.createMany({ data: products })

    const cashInventory = [
      { denomination: 1, quantity: 100, type: 'COIN' },
      { denomination: 5, quantity: 100, type: 'COIN' },
      { denomination: 10, quantity: 100, type: 'COIN' },
      { denomination: 20, quantity: 50, type: 'BANKNOTE' },
      { denomination: 50, quantity: 50, type: 'BANKNOTE' },
      { denomination: 100, quantity: 30, type: 'BANKNOTE' },
      { denomination: 500, quantity: 10, type: 'BANKNOTE' },
      { denomination: 1000, quantity: 5, type: 'BANKNOTE' }
    ]
    await prisma.cashInventory.createMany({ data: cashInventory })
    console.log('Database seeded!')
  } else {
    console.log('Data existed. Skip seeding')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
