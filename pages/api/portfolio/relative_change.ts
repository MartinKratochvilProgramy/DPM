import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const relativeChange = await prisma.relativeChange.findMany({
      where: {
        userEmail: email
      }
    })

    if (relativeChange !== null) {
      res.status(200).json({ relativeChange })
    } else {
      res.status(200).json({ relativeChange: [] })
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
