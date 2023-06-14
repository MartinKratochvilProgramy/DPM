import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = JSON.parse(req.body)

    const stocks = await prisma.stocks.findUnique({
      where: {
        email
      }
    })

    if (stocks === null) {
      res.json({ currency: undefined })
    } else {
      res.json({ currency: stocks.currency })
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
