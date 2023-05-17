import { type FormattedStockInterface, type PurchaseHistoryInterface } from '@/types/api/stock'
import clientPromise from '../../lib/mongodb'
import { type NextApiRequest, type NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username } = JSON.parse(req.body)

      const client = await clientPromise
      const db = client.db('portfolio')

      const collection = await db
        .collection('stocks')
        .find({ username })
        .limit(1)
        .toArray()

      const stocks = formatStocks(collection[0])

      if (stocks !== null) {
        res.json(stocks)
      } else {
        res.status(404)
        res.json({
          message: 'Stocks not found'
        })
      }
    } catch (e) {
      res.json({ err: e })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

function formatStocks (foundStocks: any): FormattedStockInterface[] {
  // returns array of formatter user stocks
  // [{ticker, amount, prevClose, _id, firstPurchase, lastPurchase}]

  const stocks = foundStocks.stocks
  const purchaseHistory = foundStocks.purchaseHistory

  const result: FormattedStockInterface[] = []

  for (let i = 0; i < stocks.length; i++) {
    // construct array of stock objects {ticker, amount, prevClose, _id, firstPurchase, lastPurchase}
    const ticker = stocks[i].ticker
    const index = purchaseHistory.findIndex((stock: PurchaseHistoryInterface) => stock.ticker === ticker) // index of ticker in purchaseHistory

    const stockObject: FormattedStockInterface = {
      ticker: stocks[i].ticker,
      amount: stocks[i].amount,
      prevClose: stocks[i].prevClose,
      _id: stocks[i]._id,
      firstPurchase: purchaseHistory[index].purchases[0].date,
      lastPurchase: purchaseHistory[index].purchases[purchaseHistory[index].purchases.length - 1].date,
      purchaseHistory: purchaseHistory[index].purchases
    }

    result.push(stockObject)
  }

  return result
}
