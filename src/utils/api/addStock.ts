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
    await prisma.$disconnect()
    return null
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
            prevClose: newStock.prevClose,
            firstPurchase: new Date(),
            lastPurchase: new Date(),
            purchases: {
              create: [
                {
                  date: new Date(),
                  amount: newStock.amount,
                  price: newStock.prevClose
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
                  price: newStock.prevClose
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

  await addNetWorth(email, newStock.prevClose * newStock.amount)
  await addTotalInvested(email, newStock.prevClose * newStock.amount)

  await prisma.$disconnect()
  return newStocks
}

async function addNetWorth (email: string, incrementValue: number) {
  // increase last net worth history if is the same date
  // else create new write new
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const netWorth = await prisma.netWorth.findUnique({
    where: {
      email
    },
    include: {
      netWorthHistory: true
    }
  })

  let lastNetWorth: number
  if (netWorth.netWorthHistory.length === 0) {
    lastNetWorth = 0
  } else {
    lastNetWorth = netWorth.netWorthHistory[netWorth.netWorthHistory.length - 1].netWorth
  }

  await prisma.netWorth.update({
    where: {
      email
    },
    data: {
      netWorthHistory: {
        create:
          {
            date: new Date(),
            netWorth: lastNetWorth + incrementValue
          }
      }
    },
    include: {
      netWorthHistory: true
    }
  })
}

async function addTotalInvested (email: string, newValue: number) {
  await prisma.totalInvested.update({
    where: {
      email
    },
    data: {
      totalInvestedHistory: {
        create:
          {
            date: new Date(),
            totalInvested: newValue
          }
      }
    },
    include: {
      totalInvestedHistory: true
    }
  })
}
