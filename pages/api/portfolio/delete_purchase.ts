import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateStocks } from '@/utils/api/updateStocks'
import { addNetWorth } from '@/utils/api/addNetWorth'
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker, purchaseId } = req.body

    if (email === 'demo') {
      res.status(500).json('Cannot edit in demo mode')
      return
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId
      }
    })

    if (purchase === null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker} ${purchaseId}`)
    }

    console.log(purchase)

    await prisma.purchase.delete({
      where: {
        id: purchaseId
      }
    })

    const updatedStocks = await prisma.user.update({
      where: {
        email
      },
      data: {
        stocks: {
          updateMany: {
            where: {
              ticker
            },
            data: {
              amount: {
                decrement: purchase.amount
              }
            }
          }
        }
      },
      include: {
        stocks: {
          include: {
            purchases: true
          }
        }
      }
    })

    const newTotalNetWorth = await updateStocks(email)
    const newNetWorth = await addNetWorth(email, newTotalNetWorth)
    const newTotalInvested = await incrementTotalInvested(email, -purchase?.amount * purchase?.price)

    res.json({ stocks: updatedStocks.stocks, netWorth: newNetWorth, totalInvested: newTotalInvested })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
};
