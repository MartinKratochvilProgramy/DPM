import fetch from 'node-fetch'
import prisma from '@/lib/prisma'
import { getConversionRate } from '../client/getConversionRate'
import { addNetWorth } from './addNetWorth'
import { addRelativeChange } from './addRelativeChange'

export async function updateStocks (email: string) {
  // loop through all user's stocks and update prev close
  // calculate total net worth and push it to netWorthHistory
  // calculate relative change in net worth and push it to relativeChangeHistory

  try {
    const stocks = await prisma.stocks.findUnique({
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
      return `Could not find stocks for ${email}`
    }

    let totalNetWorth = 0
    await Promise.all(
      stocks.stocks.map(async (stock) => {
        const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stock.ticker}`)
        const stockInfoJson: any = await stockInfo.json()

        const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, stocks.currency)
        const prevClose = parseFloat((parseFloat(stockInfoJson.chart.result[0].meta.previousClose) * conversionRate).toFixed(2))

        totalNetWorth += prevClose * stock.amount

        // Update the prevClose value
        const updatedStock = await prisma.stock.update({
          where: {
            ticker: stock.ticker
          },
          data: {
            prevClose
          }
        })

        return updatedStock
      })
    )

    const newNetWorth = await addNetWorth(email, totalNetWorth)
    await addRelativeChange(email, newNetWorth.netWorthValues.at(-1) / newNetWorth.netWorthValues.at(-2))

    return `Updating stocks for user ${email}`
  } catch (error) {
    return `Failed updating stocks for user ${email} ${JSON.stringify(error)}`
  }
}
