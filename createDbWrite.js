const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createStocksWrite () {
  const createdStocks = await prisma.stocks.create({
    data: {
      email: 'martvil96@gmail.com',
      currency: 'CZK',
      stocks: {
        create: []
      }
    }
  })

  return createdStocks
}

createStocksWrite()
  .then((result) => {
    console.log('Stocks updated:', result)
  })
  .catch((error) => {
    console.error('Error updating stocks:', error)
  })

async function createNetWorthWrite () {
  const createdStocks = await prisma.netWorth.create({
    data: {
      email: 'martvil96@gmail.com',
      netWorthHistory: {
        create: []
      }
    }
  })

  return createdStocks
}

createNetWorthWrite()
  .then((result) => {
    console.log('Net worth updated:', result)
  })
  .catch((error) => {
    console.error('Error updating Net worth:', error)
  })

async function createTotalInvestedWrite () {
  const createdStocks = await prisma.totalInvested.create({
    data: {
      email: 'martvil96@gmail.com',
      totalInvestedHistory: {
        create: []
      }
    }
  })

  return createdStocks
}

createTotalInvestedWrite()
  .then((result) => {
    console.log('Total invested updated:', result)
  })
  .catch((error) => {
    console.error('Error updating Total invested:', error)
  })
