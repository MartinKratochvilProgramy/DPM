import { PrismaClient } from '@prisma/client'
import { relativeChangeParsed } from './dbSource/relativeChangeParsed'
import { netWorthHistoryParsed } from './dbSource/netWorthHistoryParsed'
import { totalInvestedParsed } from './dbSource/totalInvestedHistoryParsed'

const prisma = new PrismaClient()

async function createStocksWrite () {
  try {
    const createdStocks = await prisma.stocks.create({
      data: {
        email: 'demo',
        currency: 'CZK',
        stocks: {
          create: [
            {
              ticker: 'META',
              amount: 4,
              prevClose: 5985.43,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 4,
                    price: 3343.34
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
    for (const write of netWorthHistoryParsed) {
      netWorthDates.push(new Date(write.netWorthDates))
      netWorthValues.push(write.netWorthValues)
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
    for (const write of totalInvestedParsed) {
      totalInvestedDates.push(new Date(write.totalInvestedDates))
      totalInvestedValues.push(write.totalInvestedValues)
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
    for (const write of relativeChangeParsed) {
      relativeChangeDates.push(new Date(write.relativeChangeDates))
      relativeChangeValues.push(write.relativeChangeValues)
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
