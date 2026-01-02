import fetch from 'node-fetch'
import prisma from '@/lib/prisma'
import { getConversionRate } from '../client/getConversionRate'

export async function updateStocks (email: string) {
  // loop through all user's stocks and update prev close
  // calculate total net worth and push it to netWorthHistory
  // calculate relative change in net worth and push it to relativeChangeHistory
  // returns new total net worth value

  try {
    const stocks = await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        stocks: {
          include: {
            purchases: true
          }
        }
      }
    })

    if (stocks === null) {
      throw new Error(`Could not find stocks for user ${email}`)
    }

    let newTotalNetWorth = 0
    await Promise.all(
      stocks.stocks.map(async (stock) => {
        const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock.ticker}`)
        const stockInfoJson: any = await stockInfo.json()

        const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, stocks.currency)
        const prevClose = parseFloat((parseFloat(stockInfoJson.chart.result[0].meta.previousClose) * conversionRate).toFixed(2))

        if (stock.amount > 0) {
          newTotalNetWorth += prevClose * stock.amount
        }

        // Update the prevClose value
        const updatedStock = await prisma.stock.updateMany({
          where: {
            userEmail: email,
            ticker: stock.ticker
          },
          data: {
            prevClose
          }
        })

        return updatedStock
      })
    )

    return newTotalNetWorth
  } catch (error) {
    console.log(error)
    return 0
  }
}
