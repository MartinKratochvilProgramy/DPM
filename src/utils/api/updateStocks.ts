import fetch from 'node-fetch'
import prisma from '@/lib/prisma'
import { getConversionRate } from '../client/getConversionRate'

export async function updateStocks (email: string) {
  // loop through all user's stocks and update prev close
  // calculate total net worth and push it to netWorthHistory
  // calculate relative change in net worth and push it to relativeChangeHistory
  // returns new total net worth value

  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        stocks: true
      }
    })

    if (user === null) {
      throw new Error(`Could not find stocks for user ${email}`)
    }

    let newTotalNetWorth = 0
    await Promise.all(
      user.stocks.map(async (stock) => {
        const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock.ticker}`)
        const stockInfoJson: any = await stockInfo.json()

        const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, user.currency)
        const prevClose = parseFloat((parseFloat(stockInfoJson.chart.result[0].meta.previousClose) * conversionRate).toFixed(2))

        newTotalNetWorth += prevClose * stock.amount

        // Update the prevClose value
        const updatedStock = await prisma.stock.update({
          where: {
            ticker: stock.ticker
          },
          data: {
            price: prevClose
          }
        })

        return updatedStock
      })
    )

    return newTotalNetWorth
  } catch (error) {
    return 0
  }
}
