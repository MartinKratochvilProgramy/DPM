import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateStocks } from '@/utils/api/updateStocks'
import { addNetWorth } from '@/utils/api/addNetWorth'
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested'
import { getAccount } from '@/utils/api/getAccount'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker, purchaseId } = req.body

    const purchase = await prisma.purchase.delete({
      where: {
        id: purchaseId
      }
    })

    if (purchase === null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker} ${purchaseId}`)
    }

    const newTotalNetWorth = await updateStocks(email)
    await addNetWorth(email, newTotalNetWorth)
    await incrementTotalInvested(email, -purchase?.amount * purchase?.price)

    const user = await getAccount(email)

    res.json({ stocks: user.stocks, netWorth: user.netWorth, totalInvested: user.totalInvested })
  } catch (error) {
    res.status(500).json(error)
  }
};
