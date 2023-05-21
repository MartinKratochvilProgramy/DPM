import { getCurrentDate } from './getCurrentDate'
import fetch from 'node-fetch'
import Stocks from '@/lib/models/stocks'
import connectMongo from '@/lib/mongodb'
import { type StocksInterface } from '@/types/api/stock'
import { getConversionRate } from '../client/getConversionRate'

export async function updateStocks (username: string): Promise<string> {
  // loop through all user's stocks and update prev close
  // calculate total net worth and push it to netWorthHistory
  // calculate relative change in net worth and push it to relativeChangeHistory

  try {
    await connectMongo()

    const stocks: StocksInterface = await Stocks.findOne({ username }).exec()

    let totalNetWorth = 0
    for (let i = 0; i < stocks.stocks.length; i++) {
      const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stocks.stocks[i].ticker}`)
      const stockInfoJson = await stockInfo.json()

      const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, stocks.currency)

      const prevClose = (parseFloat(stockInfoJson.chart.result[0].meta.previousClose) * conversionRate).toFixed(2)
      stocks.stocks[i].prevClose = parseFloat(prevClose)

      totalNetWorth += parseFloat(prevClose) * stocks.stocks[i].amount
    }

    const today = getCurrentDate()

    stocks.netWorthHistory.push({
      date: today,
      netWorth: parseFloat((totalNetWorth).toFixed(2))
    })

    const newStocks = new Stocks(stocks)
    await newStocks.save()

    console.log('updating stocks for user ' + username)

    const response = 'updating stocks for user ' + username
    return response
  } catch (error) {
    console.log(error)
    return `Failed to update stocks for ${username}`
  }
}
