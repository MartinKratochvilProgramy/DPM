import { type TickerChartData } from '@/types/api/tickerChartData'
import { type Period } from '@/types/api/period'
import yahooFinance from 'yahoo-finance2'

const numberOfMonths = {
  '6m': -6,
  '1y': -12,
  '2y': -24,
  '5y': -60
}

function addMonths (period: Period) {
  const date = new Date()
  // return startDate with destance period from date
  date.setMonth(date.getMonth() + numberOfMonths[period])
  return date
}

export default async function getTickerChartData (
  ticker: string,
  period: Period
): Promise<TickerChartData> {
  const endDate = new Date()
  const startDate = addMonths(period)

  const query = 'TSLA'
  const queryOptions = { period1: startDate, period2: endDate }
  const quotes = await yahooFinance.historical(query, queryOptions)

  const dates: Date[] = []
  const values: number[] = []

  for (let i = 0; i < quotes.length; i++) {
    if (quotes[i].date !== null && quotes[i].open !== null) {
      dates.push(quotes[i].date)
      values.push(quotes[i].close)
    }
  }
  dates.reverse()
  values.reverse()

  return {
    ticker,
    dates,
    values
  }
}
