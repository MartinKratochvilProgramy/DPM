import { type TickerChartData } from '@/types/api/tickerChartData'
import { type Period } from '@/types/api/period'
import yahooFinance from 'yahoo-finance'

const numberOfMonths = {
  '6m': -6,
  '1y': -12,
  '2y': -24,
  '5y': -60
}

function addMonths (date: Date, period: Period) {
  date.setMonth(date.getMonth() + numberOfMonths[period])
  return date
}

export default async function getTickerChartData (
  ticker: string,
  period: Period
): Promise<TickerChartData> {
  const startDate = addMonths(new Date(), period)

  const tickerData: TickerChartData = await new Promise<TickerChartData>((resolve, reject) => {
    yahooFinance.historical({
      symbol: ticker,
      period: 'd',
      from: startDate,
      to: new Date()
    }, function (err: any, quotes: any) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (err) reject(err)

      const dates: string[] = []
      const values: number[] = []

      for (let i = 0; i < quotes.length; i++) {
        if (quotes[i].date !== null && quotes[i].open !== null) {
          dates.push(quotes[i].date.toISOString().split('T')[0])
          values.push(quotes[i].open.toFixed(2))
        }
      }
      dates.reverse()
      values.reverse()
      resolve({ ticker, dates, values })
    })
  })

  return tickerData
}
