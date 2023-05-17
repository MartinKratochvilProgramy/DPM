import clientPromise from '../mongodb'

export async function getStocks (username: string | null | undefined) {
  const client = await clientPromise
  const db = client.db('portfolio')

  const collection = await db
    .collection('stocks')
    .find({ username })
    .limit(1)
    .toArray()

  const stocks = collection[0].stocks

  return stocks
}
