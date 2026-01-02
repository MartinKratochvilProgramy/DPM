import prisma from '@/lib/prisma';

export async function createDbWrite(email: string, currency: string) {
  // create each field in user account
  await prisma.user.create({
    data: {
      email,
      currency,
      stocks: {
        create: [],
      },
    },
  });

  await prisma.netWorth.create({
    data: {
      email,
      netWorthDates: [new Date()],
      netWorthValues: [0],
    },
  });

  await prisma.totalInvested.create({
    data: {
      email,
      totalInvestedDates: [new Date()],
      totalInvestedValues: [0],
    },
  });

  await prisma.relativeChange.create({
    data: {
      email,
      relativeChangeDates: [new Date()],
      relativeChangeValues: [1],
    },
  });
}
