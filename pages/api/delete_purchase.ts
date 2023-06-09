import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateStocks } from '@/utils/api/updateStocks'
import { addNetWorth } from '@/utils/api/addNetWorth'
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker, purchaseId } = req.body

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId
      }
    })

    if (purchase === null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker} ${purchaseId}`)
    }

    const updatedStocks = await prisma.stocks.update({
      where: {
        email
      },
      data: {
        stocks: {
          update: {
            where: {
              ticker
            },
            data: {
              amount: {
                decrement: purchase?.amount
              },
              purchases: {
                deleteMany: {
                  id: purchaseId
                }
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
    console.log(error)
  }
};
