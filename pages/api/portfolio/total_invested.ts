import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const totalInvested = await prisma.totalInvested.findUnique({
      where: {
        email
      }
    })

    if (totalInvested !== null) {
      res.json({ dates: totalInvested.totalInvestedDates, values: totalInvested.totalInvestedValues })
    } else {
      res.json({ dates: [], values: [] })
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
