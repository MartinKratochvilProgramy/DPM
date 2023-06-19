import prisma from '@/lib/prisma'

export async function incrementNetWorth (email: string, incrementValue: number) {
  // increase last net worth history if is the same date
  // else create new write
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const netWorth = await prisma.netWorth.update({
    where: {
      userEmail: email
    }
  })

  if (netWorth === null) {
    throw new Error('netWorth not found')
  }

  let lastNetWorth: number
  if (netWorth.netWorthValues.length === 0) {
    lastNetWorth = 0
  } else {
    lastNetWorth = netWorth.netWorthValues[netWorth.netWorthValues.length - 1]
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
