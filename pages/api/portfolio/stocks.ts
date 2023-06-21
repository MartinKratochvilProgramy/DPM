import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = JSON.parse(req.body)

    const stocks = await prisma.stocks.findUnique({
      where: {
        email
      },
      include: {
        stocks: {
          include: {
            purchases: true
          }
        }
      }
    })

    if (stocks !== null) {
      res.json(stocks.stocks)
    } else {
      res.status(404)
      res.json({
        message: 'Stocks not found'
      })
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}
