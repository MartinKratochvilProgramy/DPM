import prisma from '@/lib/prisma'

export async function incrementNetWorth (email: string, incrementValue: number) {
  // increase last net worth history if is the same date
  // else create new write
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const lastNetWorth = await prisma.netWorth.findFirst({
    where: {
      userEmail: email
    },
    orderBy: {
      date: 'desc'
    }
  })

  if (lastNetWorth === null) {
    throw new Error('netWorth not found')
  }

  const netWorth = await prisma.netWorth.create({
    data: {
      date: new Date(),
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      value: lastNetWorth.value + incrementValue,
      user: { connect: { email } }
    }
  })

  if (netWorth === null) {
    throw new Error('Failed to create netWorth')
  }
}
