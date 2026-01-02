import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateStocks } from '@/utils/api/updateStocks'
import { addNetWorth } from '@/utils/api/addNetWorth'
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker, amountToDelete } = req.body

    if (email === 'demo') {
      res.status(500).json('Cannot edit in demo mode')
      return
    }

    // find stock
    const stock = await prisma.stock.findFirst({
      where: {
        userEmail: email,
        ticker
      }
    })

    if (stock === null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker}`)
    }

    const newStocks = await prisma.user.update({
      where: {
        email
      },
      data: {
        stocks: {
          update: {
            where: {
              id: stock.id
            },
            data: {
              amount: { decrement: amountToDelete },
              lastPurchase: new Date(),
              purchases: {
                create: {
                  date: new Date(),
                  amount: -amountToDelete,
                  price: parseFloat(stock.prevClose.toFixed(2))
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
    const newTotalInvested = await incrementTotalInvested(email, -amountToDelete * stock.prevClose)

    res.json({ stocks: newStocks, netWorth: newNetWorth, totalInvested: newTotalInvested })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
};
