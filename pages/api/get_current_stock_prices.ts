import { type NextApiRequest, type NextApiResponse } from 'next'
import { getConversionRate } from '@/utils/client/getConversionRate'
import fetch from 'node-fetch'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tickers, currency } = req.body

    const converstionRates: any = {}
    const result = []

    for (const ticker of tickers) {
      // get stocks ticker, if not exists, return
      const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${String(ticker)}`)
      const stockInfoJson: any = await stockInfo.json()
      if (stockInfoJson.chart.result === undefined || stockInfoJson.chart.result === null) {
        res.status(403)
        res.json({
          message: `Ticker not found: ${String(ticker)}`
        })
        return
      }

      const tickerCurrency: string = stockInfoJson.chart.result[0].meta.currency
      if (converstionRates[tickerCurrency] === undefined) {
        converstionRates[tickerCurrency] = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, currency)
      }

      // current price of stock in set currency
      const price = parseFloat((stockInfoJson.chart.result[0].meta.regularMarketPrice * converstionRates[tickerCurrency]).toFixed(2))

      result.push({ ticker, price })
    }

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
};
