import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const totalInvested = await prisma.totalInvested.findMany({
      where: {
        userEmail: email
      }
    })

    if (totalInvested !== null) {
      res.json(totalInvested)
    } else {
      res.json([])
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
