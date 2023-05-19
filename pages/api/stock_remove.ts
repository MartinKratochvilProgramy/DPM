import { type NextApiRequest, type NextApiResponse } from 'next'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { stockRemove } from '@/utils/api/stockRemove'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { username, ticker, newAmount } = req.body

  try {
    await stockRemove(username, ticker, newAmount, res)
    await updateStocks(username)

    const userStocks = await getUserStocks(username)
    res.json(userStocks)
  } catch (error) {
    console.log(error)
  }
};
