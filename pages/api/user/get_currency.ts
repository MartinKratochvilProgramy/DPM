import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = JSON.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (user === null) {
      res.json({ currency: undefined })
    } else {
      res.json({ currency: user.currency })
    }
  } catch (error) {
    res.status(500).json(error)
  }
};
