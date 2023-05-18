import { type NextApiRequest, type NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
    // send stocks to client
      const { newStock, currencySettings } = req.body // new stock object
      const ticker = String(newStock.ticker.toUpperCase())
      const amount = newStock.amount

      // get stocks ticker, if not exists, return
      const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`)
      const stockInfoJson = await stockInfo.json()
      if (stockInfoJson.chart.result === undefined) {
        res.status(403).json({
          message: 'Ticker not found'
        })
        return
      }

      // current price of stock in set currency
      const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, currencySettings)
      const value = (stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2)
      const stocks = await Stocks.findOne({ username }).exec()

      if (!stocks) {
        await createNewStock(username, ticker, amount, parseFloat(value))

        res.json(await getUserStocks(username))
        return
      } else {
        await addToExistingStock(stocks, ticker, amount, parseFloat(value))

        res.json(await getUserStocks(username))
        return
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
};
