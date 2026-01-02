import prisma from '@/lib/prisma';

export async function incrementTotalInvested(
  email: string,
  incrementValue: number,
) {
  try {
    const totalInvested = await prisma.totalInvested.findUnique({
      where: {
        email,
      },
    });

    if (totalInvested === null) {
      throw new Error('netWorth not found');
    }

    let lastTotalInvested: number;
    if (totalInvested.totalInvestedValues.length === 0) {
      lastTotalInvested = 0;
    } else {
      lastTotalInvested =
        totalInvested.totalInvestedValues[
          totalInvested.totalInvestedValues.length - 1
        ];
    }

    const newTotalInvested = await prisma.totalInvested.update({
      where: {
        email,
      },
      data: {
        totalInvestedDates: {
          push: new Date(),
        },
        totalInvestedValues: {
          push: parseFloat((lastTotalInvested + incrementValue).toFixed(2)),
        },
      },
    });

    return newTotalInvested;
  } catch (error: any) {
    throw new Error(error);
  }
}
