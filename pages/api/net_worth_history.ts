import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const netWorth = await prisma.netWorth.findUnique({
      where: {
        email
      }
    })

    if (netWorth !== null) {
      res.json({ dates: netWorth.netWorthDates, values: netWorth.netWorthValues })
    } else {
      res.json({ dates: [], values: [] })
    }
  } catch (error) {
    console.log(error)
  }
};
