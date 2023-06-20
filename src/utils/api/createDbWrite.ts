import prisma from '@/lib/prisma'

export async function createDbWrite (email: string, currency: string) {
  // create each field in user account
  await prisma.user.create({
    data: {
      email,
      currency,
      netWorth: {
        create: {
          date: new Date(),
          value: 0
        }
      },
      relativeChange: {
        create: {
          date: new Date(),
          value: 1
        }
      },
      totalInvested: {
        create: {
          date: new Date(),
          value: 0
        }
      }
    }
  })
}
