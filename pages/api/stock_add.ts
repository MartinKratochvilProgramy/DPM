import { type NextApiRequest, type NextApiResponse } from 'next'
import { getConversionRate } from '@/utils/client/getConversionRate'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { addStock } from '@/utils/api/addStocks'
import fetch from 'node-fetch'
import { type StockInterface } from '@/types/api/stock'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email, stockItems, settingsCurrency } = req.body
  const ticker = stockItems.ticker.toUpperCase()
  const amount = stockItems.amount

  // get stocks ticker, if not exists, return
  const stockInfo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${String(ticker)}`)
  const stockInfoJson: any = await stockInfo.json()
  if (stockInfoJson.chart.result === undefined) {
    res.status(403)
    res.json({
      message: 'Ticker not found'
    })
    return
  }

  // current price of stock in set currency
  const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, settingsCurrency)
  const prevClose = parseFloat((stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2))

  const newStock: StockInterface = {
    ticker,
    amount,
    prevClose
  }

  const newStocks = await addStock(newStock, email)
  if (newStocks === null) {
    res.json(await getUserStocks(email))
  } else {
    res.json(newStocks.stocks)
  }
};
