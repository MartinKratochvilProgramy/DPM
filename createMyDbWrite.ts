import { PrismaClient } from '@prisma/client'
import { relativeChangeParsed } from './dbSource/relativeChangeParsed'
import { netWorthHistoryParsed } from './dbSource/netWorthHistoryParsed'
import { totalInvestedParsed } from './dbSource/totalInvestedHistoryParsed'

const prisma = new PrismaClient()

async function createStocksWrite () {
  try {
    const createdStocks = await prisma.stocks.create({
      data: {
        email: 'martvil96@gmail.com',
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
            },
            {
              ticker: 'CEZ.PR',
              amount: 45,
              prevClose: 1000,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-12-13'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 37,
                    price: 755
                  },
                  {
                    date: new Date('2022-11-15'),
                    amount: 1,
                    price: 840
                  },
                  {
                    date: new Date('2022-12-13'),
                    amount: 7,
                    price: 770
                  }
                ]
              }
            },
            {
              ticker: 'AAPL',
              amount: 14,
              prevClose: 3954.06,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-11-15'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 9,
                    price: 3609.59
                  },
                  {
                    date: new Date('2022-11-15'),
                    amount: 1,
                    price: 3218.77
                  }
                ]
              }
            },
            {
              ticker: 'ERBAG.PR',
              amount: 42,
              prevClose: 726.6,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2023-3-2'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 20,
                    price: 604
                  },
                  {
                    date: new Date('2022-12-22'),
                    amount: 1,
                    price: 722.6
                  },
                  {
                    date: new Date('2023-3-2'),
                    amount: 21,
                    price: 850
                  }
                ]
              }
            },
            {
              ticker: 'MSFT',
              amount: 9,
              prevClose: 7302.13,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2023-3-2'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 6,
                    price: 5932.1
                  },
                  {
                    date: new Date('2023-3-2'),
                    amount: 3,
                    price: 5383.95
                  }
                ]
              }
            },
            {
              ticker: 'VOW.DE',
              amount: 4,
              prevClose: 3382.81,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 4,
                    price: 4162.15
                  }
                ]
              }
            },
            {
              ticker: 'INTC',
              amount: 10,
              prevClose: 683.49,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 10,
                    price: 652.5
                  }
                ]
              }
            },
            {
              ticker: 'KO',
              amount: 18,
              prevClose: 1317.36,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 18,
                    price: 1404.32
                  }
                ]
              }
            },
            {
              ticker: 'TABAK.PR',
              amount: 1,
              prevClose: 16760,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 1,
                    price: 16500
                  }
                ]
              }
            },
            {
              ticker: 'NVDA',
              amount: 5,
              prevClose: 8731.9,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 5,
                    price: 3023.35
                  }
                ]
              }
            },
            {
              ticker: 'BRK-B',
              amount: 4,
              prevClose: 7094.42,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 4,
                    price: 6983.05
                  }
                ]
              }
            },
            {
              ticker: 'AMD',
              amount: 6,
              prevClose: 2623.08,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2022-10-20'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 6,
                    price: 1435.73
                  }
                ]
              }
            },
            {
              ticker: 'CSPX.L',
              amount: 18,
              prevClose: 9614.09,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2023-3-6'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 15,
                    price: 9516.12
                  },
                  {
                    date: new Date('2022-11-14'),
                    amount: 2,
                    price: 9632.96
                  },
                  {
                    date: new Date('2023-3-6'),
                    amount: 1,
                    price: 9275.07
                  }
                ]
              }
            },
            {
              ticker: 'MONET.PR',
              amount: 434,
              prevClose: 79,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2023-3-2'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 145,
                    price: 73.6
                  },
                  {
                    date: new Date('2022-11-15'),
                    amount: 8,
                    price: 73.1
                  },
                  {
                    date: new Date('2022-12-13'),
                    amount: 69,
                    price: 71.5
                  },
                  {
                    date: new Date('2023-3-2'),
                    amount: 212,
                    price: 84.4
                  }
                ]
              }
            },
            {
              ticker: 'KOMB.PR',
              amount: 52,
              prevClose: 69,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2023-3-2'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-10-20'),
                    amount: 16,
                    price: 684
                  },
                  {
                    date: new Date('2022-12-14'),
                    amount: 7,
                    price: 647
                  },
                  {
                    date: new Date('2022-1-10'),
                    amount: 2,
                    price: 711.5
                  },
                  {
                    date: new Date('2023-3-2'),
                    amount: 27,
                    price: 747
                  }
                ]
              }
            },
            {
              ticker: 'VWCE.DE',
              amount: 134,
              prevClose: 2316.94,
              firstPurchase: new Date('2022-10-20'),
              lastPurchase: new Date('2023-3-2'),
              purchases: {
                create: [
                  {
                    date: new Date('2022-12-12'),
                    amount: 7,
                    price: 2274.04
                  },
                  {
                    date: new Date('2023-1-19'),
                    amount: 10,
                    price: 2239.2
                  },
                  {
                    date: new Date('2023-3-1'),
                    amount: 40,
                    price: 2238.8
                  },
                  {
                    date: new Date('2023-3-2'),
                    amount: 5,
                    price: 2204.94
                  },
                  {
                    date: new Date('2023-3-14'),
                    amount: 20,
                    price: 2177.28
                  },
                  {
                    date: new Date('2023-5-5'),
                    amount: 27,
                    price: 2223.42
                  },
                  {
                    date: new Date('2023-5-25'),
                    amount: 25,
                    price: 2292.83
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
        email: 'martvil96@gmail.com',
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
        email: 'martvil96@gmail.com',
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
        email: 'martvil96@gmail.com',
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
