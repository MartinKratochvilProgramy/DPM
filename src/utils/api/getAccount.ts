import prisma from '@/lib/prisma'

export async function getAccount (email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    include: {
      stocks: true,
      netWorth: true,
      totalInvested: true
    }
  })

  if (user === null) {
    throw new Error('User info not found')
  }

  return { stocks: user.stocks, netWorth: user.netWorth, totalInvested: user.totalInvested }
}
