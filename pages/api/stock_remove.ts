import { type NextApiRequest, type NextApiResponse } from 'next'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { removeStock } from '@/utils/api/removeStock'
import { formatStocks } from '@/utils/api/formatStocks'
import { updateStocks } from '@/utils/api/updateStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { username, ticker, newAmount } = req.body

  try {
    await removeStock(username, ticker, newAmount)
    await updateStocks(username)

    const userStocks = formatStocks(await getUserStocks(username))

    res.json(userStocks)
  } catch (error) {
    console.log(error)
  }
};
