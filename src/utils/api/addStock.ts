import prisma from '@/lib/prisma'
import { type StockInterface } from '@/types/api/stock'
import { incrementNetWorth } from './incrementNetWorth'
import { addTotalInvested } from './addTotalInvested'

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

  const newNetWorth = await incrementNetWorth(email, newStock.prevClose * newStock.amount)
  const newTotalInvested = await addTotalInvested(email, newStock.prevClose * newStock.amount)

  await prisma.$disconnect()
  return { newStocks, newNetWorth, newTotalInvested }
}
