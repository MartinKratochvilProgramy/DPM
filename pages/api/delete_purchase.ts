import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
// import { getUserStocks } from '@/utils/api/getUserStocks'
// import { updateStocks } from '@/utils/api/updateStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { email, ticker, purchaseId } = req.body

  const purchase = await prisma.purchase.findUnique({
    where: {
      id: purchaseId
    }
  })

  try {
    const newStocks = await prisma.stocks.update({
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

    // await updateStocks(username)

    res.json(newStocks.stocks)
  } catch (error) {
    console.log(error)
  }
  await prisma.$disconnect()
};
