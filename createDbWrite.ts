import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createStocksWrite () {
  try {
    const createdStocks = await prisma.user.create({
      data: {
        email: 'martvil96@gmail.com',
        currency: 'CZK',
        stocks: {
          create: []
        },
        netWorth: {
          create: {
            date: new Date(),
            value: 0
          }
        },
        relativeChange: {
          create: {
            date: new Date(),
            value: 1
          }
        },
        totalInvested: {
          create: {
            date: new Date(),
            value: 0
          }
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
