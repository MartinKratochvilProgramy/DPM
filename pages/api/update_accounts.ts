import { type NextApiRequest, type NextApiResponse } from 'next'
import { updateAccount } from '@/utils/api/updateAccount'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const users = await prisma.user.findMany()

    const responses = []

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const response = await updateAccount(user.email)
      responses.push(response)
    }

    res.status(200).json(responses)
  } catch (error) {
    res.status(500).json(error)
  }
};
