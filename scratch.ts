import prisma from './lib/prisma'

async function main () {
  const stocks = await prisma.stocks.findMany({
    where: {
      email: 'martvil96@gmail.com'
    }
  })
  console.log(stocks)
}

main().catch()
