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
      res.status(404).json({ message: 'User not found' })
      return
    }

    const currency = stocks.currency

    res.json({ currency })
  } catch (error) {
    console.log(error)
  }
};
