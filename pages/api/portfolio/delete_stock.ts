import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateStocks } from '@/utils/api/updateStocks'
import { addNetWorth } from '@/utils/api/addNetWorth'
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker } = req.body

    if (email === 'demo') {
      res.status(500).json('Cannot edit in demo mode')
      return
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        stock: {
          userEmail: email,
          ticker
        }
      }
    })

    if (purchases === null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker}`)
    }

    let decrementTotalInvested = 0
    for (const purchase of purchases) {
      decrementTotalInvested += purchase.amount * purchase.price
    }

    const stockId = await prisma.stock.findMany({
      where: {
        userEmail: email,
        ticker
      }
    })

    await prisma.purchase.deleteMany({
      where: {
        stockId: stockId[0].id
      }
    })

    await prisma.stock.deleteMany({
      where: {
        id: stockId[0].id
      }
    })

    const stocks = await prisma.user.findUnique({
      where: {
        email
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
    const newTotalInvested = await incrementTotalInvested(email, -decrementTotalInvested)

    res.json({ stocks: stocks?.stocks, netWorth: newNetWorth, totalInvested: newTotalInvested })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
};
