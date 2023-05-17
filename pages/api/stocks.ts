import clientPromise from '../../lib/mongodb'
import { type NextApiRequest, type NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')

    const collection = await db
      .collection('stocks')
      .find({ username: 'martvil96@gmail.com' })
      .limit(1)
      .toArray()

    const stocks = collection[0].stocks

    if (stocks.length > 0) {
      res.json(stocks)
    } else {
      res.status(404)
      res.json({
        message: 'Stocks not found'
      })
    }
  } catch (e) {
  }
}
