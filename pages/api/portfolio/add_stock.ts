import { type NextApiRequest, type NextApiResponse } from 'next'
import { getConversionRate } from '@/utils/client/getConversionRate'
import { addStock } from '@/utils/api/addStock'
import fetch from 'node-fetch'
import { type StockInterface } from '@/types/api/stock'
import { getAccount } from '@/utils/api/getAccount'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, stockItems, settingsCurrency } = req.body
    const ticker = stockItems.ticker.toUpperCase()
    const amount = stockItems.amount

    if (email === 'demo') {
      res.status(500).json('Cannot edit in demo mode')
      return
    }

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

    const conversionRate = await getConversionRate(stockInfoJson.chart.result[0].meta.currency, settingsCurrency)

    // current price of stock in set currency
    const prevClose = parseFloat((stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2))

    const newStock: StockInterface = {
      ticker,
      amount,
      price: prevClose
    }

    console.log(newStock)

    await addStock(newStock, email)

    const user = await getAccount(email)

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
};
