import prisma from '@/lib/prisma'

export async function addNetWorth (email: string, newValue: number) {
  // increase last net worth history if is the same date
  // else create new write new
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  try {
    const newNetWorth = await prisma.netWorth.update({
      where: {
        email
      },
      data: {
        netWorthDates: {
          push: new Date()
        },
        netWorthValues: {
          push: parseFloat((newValue).toFixed(2))
        }
      }
    })

    return newNetWorth
  } catch (error: any) {
    throw new Error(error)
  }
}
