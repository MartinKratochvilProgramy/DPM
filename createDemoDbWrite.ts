import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const data = require('./dbSource/stocks.json')

const prisma = new PrismaClient()

async function createStocksWrite () {
  try {
    const createdStocks = await prisma.stocks.create({
      data: {
        email: 'demo',
        currency: 'USD',
        stocks: {
          create: [
            {
              ticker: 'AAPL',
              amount: 3,
              prevClose: 186.01,
              firstPurchase: new Date('2022-10-18'),
              lastPurchase: new Date('2022-10-21'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-18'),
                    amount: 1,
                    price: 143.79
                  },
                  {
                    date: new Date('2022-10-19'),
                    amount: 1,
                    price: 142.96
                  },
                  {
                    date: new Date('2022-10-21'),
                    amount: 1,
                    price: 142.96
                  }
                ]
              }
            },
            {
              ticker: 'TSLA',
              amount: 1,
              prevClose: 255.9,
              firstPurchase: new Date('2022-10-18'),
              lastPurchase: new Date('2022-10-18'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-18'),
                    amount: 1,
                    price: 219.53
                  }
                ]
              }
            },
            {
              ticker: 'MSFT',
              amount: 2,
              prevClose: 348.1,
              firstPurchase: new Date('2022-10-18'),
              lastPurchase: new Date('2022-10-24'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-18'),
                    amount: 1,
                    price: 236.85
                  },
                  {
                    date: new Date('2022-10-24'),
                    amount: 1,
                    price: 241.51
                  }
                ]
              }
            },
            {
              ticker: 'AMZN',
              amount: 2,
              prevClose: 127.11,
              firstPurchase: new Date('2022-10-19'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-19'),
                    amount: 1,
                    price: 114.33
                  },
                  {
                    date: new Date('2022-10-20'),
                    amount: 1,
                    price: 114.51
                  }
                ]
              }
            }
          ]
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
    const netWorthDates: Date[] = []
    const netWorthValues: number[] = []
    for (const write of data[0].netWorthHistory) {
      netWorthDates.push(new Date(write.date))
      netWorthValues.push(write.netWorth)
    }
    const createdStocks = await prisma.netWorth.create({
      data: {
        email: 'demo',
        netWorthDates,
        netWorthValues
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

async function createTotalInvestedWrite () {
  try {
    const totalInvestedDates: Date[] = []
    const totalInvestedValues: number[] = []
    for (const write of data[0].totalInvestedHistory) {
      totalInvestedDates.push(new Date(write.date))
      totalInvestedValues.push(write.total)
    }
    const createdStocks = await prisma.totalInvested.create({
      data: {
        email: 'demo',
        totalInvestedDates,
        totalInvestedValues
      }
    })

    return createdStocks
  } catch (error: any) {
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

async function createRelativeChangeWrite () {
  try {
    const relativeChangeDates: Date[] = []
    const relativeChangeValues = []
    for (const write of data[0].relativeChangeHistory) {
      relativeChangeDates.push(new Date(write.date))
      relativeChangeValues.push(write.relativeChange)
    }
    const createdRelativeChange = await prisma.relativeChange.create({
      data: {
        email: 'demo',
        relativeChangeDates,
        relativeChangeValues
      }
    })

    return createdRelativeChange
  } catch (error: any) {
    throw new Error(error)
  }
}

createRelativeChangeWrite()
  .then((result) => {
    console.log('Relative change invested updated:', result)
  })
  .catch((error) => {
    console.error('Error updating relative change invested:', error)
  })
