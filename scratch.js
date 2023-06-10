const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main () {
  const stocks = await prisma.stocks.findMany()
  console.log(stocks)
}

// main().catch()

const res = () => {
  return 1 + 1
}
console.log(res())
