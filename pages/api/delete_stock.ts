import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
// import { getUserStocks } from '@/utils/api/getUserStocks'
// import { updateStocks } from '@/utils/api/updateStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { email, ticker } = req.body

  try {
    const updatedStocks = await prisma.stocks.update({
      where: {
        email
      },
      data: {
        stocks: {
          deleteMany: {
            ticker
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

    console.log(updatedStocks)

    res.json(updatedStocks.stocks)
  } catch (error) {
    console.log(error)
  }
  await prisma.$disconnect()
};
