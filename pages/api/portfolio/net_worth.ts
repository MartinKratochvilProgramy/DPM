import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const netWorth = await prisma.netWorth.findMany({
      where: {
        userEmail: email
      }
    })

    if (netWorth !== null) {
      res.status(200).json({ netWorth })
    } else {
      res.status(200).json({ netWorth: [] })
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
