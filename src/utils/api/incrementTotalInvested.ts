import prisma from '@/lib/prisma'

export async function incrementTotalInvested (email: string, incrementValue: number) {
  const lastTotalInvested = await prisma.totalInvested.findFirst({
    where: {
      userEmail: email
    },
    orderBy: {
      date: 'desc'
    }
  })

  if (lastTotalInvested === null) {
    throw new Error('netWorth not found')
  }

  const totalInvested = await prisma.totalInvested.create({
    data: {
      date: new Date(),
      value: lastTotalInvested.value + incrementValue,
      user: { connect: { email } }
    }
  })

  if (totalInvested === null) {
    throw new Error('Failed to create netWorth')
  }
}
