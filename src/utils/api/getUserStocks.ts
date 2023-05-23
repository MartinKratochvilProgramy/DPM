import prisma from '@/lib/prisma'

export const getUserStocks = async (email: string) => {
  const stocks = await prisma.stocks.findUnique({
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

  if (stocks === null) return null

  return stocks.stocks
}
