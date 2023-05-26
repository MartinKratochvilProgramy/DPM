import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body

  const netWorth = await prisma.netWorth.findUnique({
    where: {
      email
    },
    include: {
      netWorthHistory: true
    }
  })

  if (netWorth !== null) {
    res.json(netWorth.netWorthHistory)
  } else {
    res.json([])
  }
};
