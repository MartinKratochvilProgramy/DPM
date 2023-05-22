import { type NextApiRequest, type NextApiResponse } from 'next'
// import { getUserStocks } from '@/utils/api/getUserStocks'
// import { formatStocks } from '@/utils/api/formatStocks'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username } = JSON.parse(req.body)

      const stocks = await prisma.stocks.findUnique({
        where: {
          email: username
        },
        include: {
          stocks: {
            include: {
              purchases: true
            }
          }
        }
      })

      console.log(stocks)

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
