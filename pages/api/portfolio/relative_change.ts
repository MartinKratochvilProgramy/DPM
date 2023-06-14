import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const relativeChange = await prisma.relativeChange.findUnique({
      where: {
        email
      }
    })

    if (relativeChange !== null) {
      res.json({ dates: relativeChange.relativeChangeDates, values: relativeChange.relativeChangeValues })
    } else {
      res.json({ dates: [], values: [] })
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
