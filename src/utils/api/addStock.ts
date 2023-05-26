import prisma from '@/lib/prisma'
import { type StockInterface } from '@/types/api/stock'

export async function addStock (newStock: StockInterface, email: string) {
  const existingStocks = await prisma.stocks.findUnique({
    where: {
      email
    },
    include: {
      stocks: {
        where: {
          ticker: newStock.ticker
        },
        include: {
          purchases: true
        }
      }
    }
  })

  if (existingStocks === null) {
    throw new Error('Stocks not found')
  }

  let newStocks

  if (existingStocks.stocks.length === 0) {
    // create new stock
    newStocks = await prisma.stocks.update({
      where: {
        email
      },
      data: {
        stocks: {
          create: {
            ticker: newStock.ticker,
            amount: newStock.amount,
            prevClose: parseFloat(newStock.prevClose.toFixed(2)),
            firstPurchase: new Date(),
            lastPurchase: new Date(),
            purchases: {
              create: [
                {
                  date: new Date(),
                  amount: newStock.amount,
                  price: parseFloat(newStock.prevClose.toFixed(2))
                }
              ]
            }
          }
        }
      },
      include: {
        stocks: {
          include: {
            purchases: true
          }
        }
      }
    })
  } else {
    // increment existing stock

    newStocks = await prisma.stocks.update({
      where: {
        email
      },
      data: {
        stocks: {
          update: {
            where: {
              ticker: newStock.ticker
            },
            data: {
              amount: { increment: newStock.amount },
              lastPurchase: new Date(),
              purchases: {
                create: {
                  date: new Date(),
                  amount: newStock.amount,
                  price: parseFloat(newStock.prevClose.toFixed(2))
                }
              }
            }
          }
        }
      },
      include: {
        stocks: {
          include: {
            purchases: true
          }
        }
      }
    })
  }

  const newNetWorth = await addNetWorth(email, newStock.prevClose * newStock.amount)
  const newTotalInvested = await addTotalInvested(email, newStock.prevClose * newStock.amount)

  await prisma.$disconnect()
  return { newStocks, newNetWorth, newTotalInvested }
}

async function addNetWorth (email: string, incrementValue: number) {
  // increase last net worth history if is the same date
  // else create new write new
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const netWorth = await prisma.netWorth.findUnique({
    where: {
      email
    }
  })

  if (netWorth === null) {
    throw new Error('netWorth not found')
  }

  let lastNetWorth: number
  if (netWorth.netWorthValues.length === 0) {
    lastNetWorth = 0
  } else {
    lastNetWorth = netWorth.netWorthValues[netWorth.netWorthValues.length - 1]
  }

  const newNetWorth = await prisma.netWorth.update({
    where: {
      email
    },
    data: {
      netWorthDates: {
        push: new Date()
      },
      netWorthValues: {
        push: parseFloat((lastNetWorth + incrementValue).toFixed(2))
      }
    }
  })

  return newNetWorth
}

async function addTotalInvested (email: string, newValue: number) {
  const newTotalInvested = await prisma.totalInvested.update({
    where: {
      email
    },
    data: {
      totalInvestedDates: {
        push: new Date()
      },
      totalInvestedValues: {
        push: parseFloat((newValue).toFixed(2))
      }
    }
  })

  return newTotalInvested
}
