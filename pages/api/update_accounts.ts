import { type NextApiRequest, type NextApiResponse } from 'next'
import { updateAccount } from '@/utils/api/updateAccount'
import prisma from '@/lib/prisma'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // update all user accounts

  try {
    const ts = new Date()
    const users = await prisma.user.findMany()

    const failMessages = []

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const response = await updateAccount(user.email)
      if (!response.status) {
        failMessages.push(response)
      }
    }

    const te = new Date()

    console.log({
      executionTime: `${ts.getMilliseconds() - te.getMilliseconds()}ms`,
      numberOfAccounts: users.length,
      numberOfFailedAccounts: failMessages.length,
      failMessages
    })

    res.status(200).send({ success: true })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false })
  }
};
