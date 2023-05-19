import clientPromise from '@/lib/mongodb'
import { type StocksInterface } from '@/types/api/stock'

export async function getUserStocks (username: string): Promise<StocksInterface> {
  const client = await clientPromise
  const db = client.db('portfolio')

  const collection = await db
    .collection('stocks')
    .find({ username })
    .limit(1)
    .toArray()

  const stocks = collection[0]

  return stocks
}
