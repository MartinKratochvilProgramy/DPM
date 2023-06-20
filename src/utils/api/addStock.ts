import prisma from '@/lib/prisma'
import { type StockInterface } from '@/types/api/stock'
import { incrementNetWorth } from './incrementNetWorth'
import { incrementTotalInvested } from './incrementTotalInvested'

export async function addStock (newStock: StockInterface, email: string) {
  const user = await prisma.user.findUnique({
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

  if (user === null) {
    throw new Error('Stocks not found')
  }

  if (user.stocks.length === 0) {
    console.log(user.stocks.length)
    // create new stock
    const newStock = await prisma.stock.create({
      data: {
        ticker: 'AAPL',
        amount: 100,
        price: 150.5,
        firstPurchase: new Date(),
        lastPurchase: new Date(),
        userEmail: 'user@example.com'
      }
    })

    // const purchase = await prisma.purchase.create({
    //   data: {
    //     date: new Date(),
    //     amount: newStock.amount,
    //     price: newStock.price,
    //     stock: {
    //       connect: {
    //         ticker: newStock.ticker,
    //         userEmail: email
    //       }
    //     }
    //   }
    // })
    console.log('stock', newStock)
  } else {
    // increment existing stock
    await prisma.purchase.create({
      data: {
        amount: newStock.amount,
        date: new Date(),
        price: newStock.price,
        stock: {
          connect: {
            ticker: newStock.ticker
          }
        }
      }
    })
  }

  await incrementNetWorth(email, newStock.price * newStock.amount)
  await incrementTotalInvested(email, newStock.price * newStock.amount)
}
