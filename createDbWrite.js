const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createStocksWrite () {
  try {
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
  } catch (error) {
    throw new Error(error)
  }
}

createStocksWrite()
  .then((result) => {
    console.log('Stocks updated:', result)
  })
  .catch((error) => {
    console.error('Error updating stocks:', error)
  })

async function createNetWorthWrite () {
  try {
    const createdStocks = await prisma.netWorth.create({
      data: {
        email: 'martvil96@gmail.com',
        netWorthDates: [new Date()],
        netWorthValues: [0]
      }
    })

    return createdStocks
  } catch (error) {
    throw new Error(error)
  }
}

createNetWorthWrite()
  .then((result) => {
    console.log('Net worth updated:', result)
  })
  .catch((error) => {
    console.error('Error updating Net worth:', error)
  })

async function createTotalInvestedWrite () {
  try {
    const createdStocks = await prisma.totalInvested.create({
      data: {
        email: 'martvil96@gmail.com',
        totalInvestedDates: [new Date()],
        totalInvestedValues: [0]
      }
    })

    return createdStocks
  } catch (error) {
    throw new Error(error)
  }
}

createTotalInvestedWrite()
  .then((result) => {
    console.log('Total invested updated:', result)
  })
  .catch((error) => {
    console.error('Error updating Total invested:', error)
  })
