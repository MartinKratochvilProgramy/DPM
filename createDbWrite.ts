import { PrismaClient, type Stock, type Stocks } from '@prisma/client'
import { type StockInterface, type FormattedStockInterface } from './types/api/stock'

const prisma = new PrismaClient()

const stocks: FormattedStockInterface = {
  ticker: 'AAPL',
  amount: 1,
  prevClose: 3603.1,
  firstPurchase: new Date(),
  lastPurchase: new Date(),
  purchaseHistory: [
    {}
  ]

}

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
  } catch (error: any) {
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
  } catch (error: any) {
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

// async function createTotalInvestedWrite () {
//   try {
//     const createdStocks = await prisma.totalInvested.create({
//       data: {
//         email: 'martvil96@gmail.com',
//         totalInvestedDates: [new Date()],
//         totalInvestedValues: [0]
//       }
//     })

//     return createdStocks
//   } catch (error: any) {
//     throw new Error(error)
//   }
// }

// createTotalInvestedWrite()
//   .then((result) => {
//     console.log('Total invested updated:', result)
//   })
//   .catch((error) => {
//     console.error('Error updating Total invested:', error)
//   })

async function createRelativeChangeWrite () {
  try {
    const createdRelativeChange = await prisma.relativeChange.create({
      data: {
        email: 'martvil96@gmail.com',
        relativeChangeDates: [new Date()],
        relativeChangeValues: [1]
      }
    })

    return createdRelativeChange
  } catch (error: any) {
    throw new Error(error)
  }
}

createRelativeChangeWrite()
  .then((result) => {
    console.log('Total invested updated:', result)
  })
  .catch((error) => {
    console.error('Error updating Total invested:', error)
  })
