import { type NextApiRequest, type NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateStocks } from '@/utils/api/updateStocks'
// import { getUserStocks } from '@/utils/api/getUserStocks'
// import { updateStocks } from '@/utils/api/updateStocks'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  const { email } = req.body

  try {
    const response = await updateStocks(email)
    res.json({ response })
  } catch (error) {
    console.log(error)
  }
  await prisma.$disconnect()
};
