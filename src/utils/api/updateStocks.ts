import { getCurrentDate } from './getCurrentDate'
import fetch from 'node-fetch'
import { getUserStocks } from './getUserStocks'

export async function updateStocks (username: string): Promise<string> {
  // loop through all user's stocks and update prev close
  // calculate total net worth and push it to netWorthHistory
  // calculate relative change in net worth and push it to relativeChangeHistory

  const stocks = await getUserStocks(username)

  let totalNetWorth = 0
  for (let i = 0; i < stocks.stocks.length; i++) {
    const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stocks.stocks[i].ticker}`)
    const stockInfoJson = await stockInfo.json()

    // get conversion rate from set currency -> user currency
    // if stock currency === user settings currency, conversion is 1
    let conversionRate
    if (stockInfoJson?.chart.result[0].meta.currency === user.settings.currency) {
      conversionRate = 1
    } else {
      const conversionRateSrc = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stockInfoJson.chart.result[0].meta.currency}${user.settings.currency}=X`)
      const conversionRateJson = await conversionRateSrc.json()
      conversionRate = conversionRateJson.chart.result[0].meta.previousClose
    }

    const prevClose = (stockInfoJson.chart.result[0].meta.previousClose * conversionRate).toFixed(2)
    stocks.stocks[i].prevClose = prevClose

    totalNetWorth += parseFloat(prevClose) * stocks.stocks[i].amount
  }

  const today = getCurrentDate()

  stocks.netWorthHistory.push({
    date: today,
    netWorth: parseFloat((totalNetWorth).toFixed(2))
  })
  await stocks.save()

  const response = 'updating stocks for user ' + username
  return response
}
