import prisma from '@/lib/prisma'

export async function addNetWorth (email: string, newValue: number) {
  // increase last net worth history if is the same date
  // else create new write new
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  await prisma.netWorth.create({
    data: {
      date: new Date(),
      value: parseFloat((newValue).toFixed(2)),
      user: { connect: { email } }
    }
  })
}
