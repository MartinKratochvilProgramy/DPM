import prisma from '@/lib/prisma'

export async function incrementNetWorth (email: string, incrementValue: number) {
  // increase last net worth history if is the same date
  // else create new write
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const netWorth = await prisma.netWorth.create({
    data: {
      date: new Date(),
      value: incrementValue,
      user: { connect: { email } }
    }
  })

  if (netWorth === null) {
    throw new Error('netWorth not found')
  }

  const netWorthValues = await prisma.netWorth.findMany({
    where: {
      userEmail: email
    },
    orderBy: {
      date: 'asc'
    }
  })

  let lastNetWorth: number
  if (netWorthValues.length === 0) {
    lastNetWorth = 0
  } else {
    lastNetWorth = netWorthValues[netWorthValues.length - 1].value
  }

  const newNetWorth = await prisma.netWorth.update({
    where: {
      email
    },
    data: {
      netWorth: {
        push
      }
    }
  })

  return newNetWorth
}
