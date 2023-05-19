import { type NextApiRequest, type NextApiResponse } from 'next'
import { getConversionRate } from '@/utils/client/getConversionRate'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { addToExistingStock, createNewStock } from '@/utils/api/addStocks'
import fetch from 'node-fetch'
import { formatStocks } from '@/utils/api/formatStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, stockItems, settingsCurrency } = req.body
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
    const value = (stockInfoJson.chart.result[0].meta.regularMarketPrice * conversionRate).toFixed(2)

    const stocks = await getUserStocks(username)

    if (stocks === undefined) {
      await createNewStock(username, ticker, amount, parseFloat(value))
    } else {
      await addToExistingStock(username, stocks, ticker, amount, parseFloat(value))
    }
    res.json(formatStocks(await getUserStocks(username)))
  } catch (error) {
    console.log(error)
  }
};
