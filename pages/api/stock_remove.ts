import { type NextApiRequest, type NextApiResponse } from 'next'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { removeStock } from '@/utils/api/removeStock'
import { formatStocks } from '@/utils/api/formatStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { username, ticker, newAmount } = req.body

  try {
    await removeStock(username, ticker, newAmount, res)
    // await updateStocks(username)

    const userStocks = formatStocks(await getUserStocks(username))

    console.log(userStocks)

    res.json(userStocks)
  } catch (error) {
    console.log(error)
  }
};
