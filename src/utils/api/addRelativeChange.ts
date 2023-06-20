import prisma from '@/lib/prisma'

export async function addRelativeChange (email: string, newValue: number) {
  // increase last net worth history if is the same date
  // else create new write new
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const lastRelativeChange = await prisma.relativeChange.findFirst({
    where: {
      userEmail: email
    },
    orderBy: {
      date: 'desc'
    }
  })

  if (lastRelativeChange === null) {
    throw new Error('relativeChange not found')
  }

  await prisma.relativeChange.create({
    data: {
      date: new Date(),
      value: parseFloat((lastRelativeChange.value * newValue).toFixed(4)),
      user: { connect: { email } }
    }
  })
}
