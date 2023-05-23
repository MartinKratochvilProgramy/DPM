import { type NextApiRequest, type NextApiResponse } from 'next'
import { getUserStocks } from '@/utils/api/getUserStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = JSON.parse(req.body)

      const stocks = await getUserStocks(email)

      if (stocks !== null) {
        res.json(stocks)
      } else {
        res.status(404)
        res.json({
          message: 'Stocks not found'
        })
      }
    } catch (e) {
      console.log(e)
      res.json({ err: e })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
