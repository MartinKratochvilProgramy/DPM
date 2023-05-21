import { type NextApiRequest, type NextApiResponse } from 'next'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { removeStock } from '@/utils/api/removeStock'
import { updateStocks } from '@/utils/api/updateStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { username, ticker, newAmount } = req.body

  try {
    await removeStock(username, ticker, newAmount)
    await updateStocks(username)

    res.json(await getUserStocks(username))
  } catch (error) {
    console.log(error)
  }
};
