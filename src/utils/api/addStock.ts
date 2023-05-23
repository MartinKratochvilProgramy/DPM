import prisma from '@/lib/prisma'
import { type StockInterface } from '@/types/api/stock'

export async function addStock (newStock: StockInterface, userEmail: string) {
  const existingStocks = await prisma.stocks.findUnique({
    where: {
      email: userEmail
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

  if (existingStocks.stocks.length === 0) {
    // create new stock
    const newStocks = await prisma.stocks.update({
      where: {
        email: userEmail
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

    await prisma.$disconnect()
    return newStocks
  } else {
    // increment existing stock

    const newStocks = await prisma.stocks.update({
      where: {
        email: userEmail
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

    await prisma.$disconnect()
    return newStocks
  }
}

async function increaseNetWorth (username: string, today: string, amount: number) {
  // increase last net worth history if is the same date
  // else create new write new
  const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  if (netWorthHistory[netWorthHistory.length - 1].date === today) {
    netWorthHistory[netWorthHistory.length - 1].netWorth += parseFloat((amount).toFixed(2))
  } else {
    const newNetWorth = netWorthHistory[netWorthHistory.length - 1].netWorth + parseFloat((amount).toFixed(2))
    netWorthHistory.push({
      date: today,
      netWorth: newNetWorth
    })
  }
  const newNetWorthHistory = new NetWorthHistory(netWorthHistory)
  await newNetWorthHistory.save()
}

async function increaseTotalInvestedHistory (username: string, today: string, amount: number) {
  const totalInvestedHistory: TimeDependetNumber[] = await TotalInvestedHistory.findOne({ username }).exec()

  if (totalInvestedHistory[totalInvestedHistory.length - 1].date === today) {
    totalInvestedHistory[totalInvestedHistory.length - 1].netWorth += parseFloat((amount).toFixed(2))
  } else {
    const newNetWorth = totalInvestedHistory[totalInvestedHistory.length - 1].netWorth + parseFloat((amount).toFixed(2))
    totalInvestedHistory.push({
      date: today,
      netWorth: newNetWorth
    })
  }
  const newTotalInvestedHistory = new TotalInvestedHistory(totalInvestedHistory)
  await newTotalInvestedHistory.save()
}
