import { getCurrentDate } from './getCurrentDate'
import fetch from 'node-fetch'
import { getUserStocks } from './getUserStocks'
import { getConversionRate } from '../client/getConversionRate'
import clientPromise from '@/lib/mongodb'

export async function updateStocks (username: string): Promise<string> {
  // loop through all user's stocks and update prev close
  // calculate total net worth and push it to netWorthHistory
  // calculate relative change in net worth and push it to relativeChangeHistory

  try {
    const stocks = await getUserStocks(username)

    let totalNetWorth = 0
    for (let i = 0; i < stocks.stocks.length; i++) {
      const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stocks.stocks[i].ticker}`)
      const stockInfoJson = await stockInfo.json()

      // get conversion rate from set currency -> user currency
      // if stock currency === user settings currency, conversion is 1

      const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, stocks.currency)

      const prevClose = (stockInfoJson.chart.result[0].meta.previousClose * conversionRate).toFixed(2)
      stocks.stocks[i].prevClose = parseFloat(prevClose)

      totalNetWorth += parseFloat(prevClose) * stocks.stocks[i].amount
    }

    const today = getCurrentDate()

    stocks.netWorthHistory.push({
      date: today,
      netWorth: parseFloat((totalNetWorth).toFixed(2))
    })

    const client = await clientPromise
    const db = client.db('portfolio')

    await db
      .collection('stocks')
      .replaceOne({ username }, stocks)

    const response = 'Updating stocks for user ' + username
    return response
  } catch (error) {
    console.log(error)
    return `Failed to update stocks for ${username}`
  }
}
