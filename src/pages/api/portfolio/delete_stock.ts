import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { updateStocks } from '@/utils/api/updateStocks';
import { addNetWorth } from '@/utils/api/addNetWorth';
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker, amountToDelete } = req.body;
    const parsedAmount = Number(amountToDelete);

    if (email === 'demo') {
      res.status(500).json('Cannot edit in demo mode');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json('Invalid amount');
      return;
    }

    // find stock
    const stock = await prisma.stock.findFirst({
      where: {
        userEmail: email,
        ticker,
      },
    });

    if (stock === null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker}`);
    }

    if (parsedAmount > stock.amount) {
      res.status(400).json('Cannot remove more than the current amount');
      return;
    }

    const isFullRemoval = parsedAmount === stock.amount;

    if (!isFullRemoval && !Number.isInteger(parsedAmount)) {
      res.status(400).json('Partial removal amount must be a whole number');
      return;
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (isFullRemoval) {
        await tx.purchase.deleteMany({
          where: {
            stockId: stock.id,
          },
        });

        await tx.stock.delete({
          where: {
            id: stock.id,
          },
        });
      } else {
        await tx.stock.update({
          where: {
            id: stock.id,
          },
          data: {
            amount: { decrement: parsedAmount },
            lastPurchase: new Date(),
            purchases: {
              create: {
                date: new Date(),
                amount: -parsedAmount,
                price: parseFloat(stock.prevClose.toFixed(2)),
              },
            },
          },
        });
      }

      return tx.user.findUnique({
        where: {
          email,
        },
        include: {
          stocks: {
            include: {
              purchases: true,
            },
          },
        },
      });
    });

    if (updatedUser === null) {
      throw new Error(`User not found: ${String(email)}`);
    }

    const newTotalNetWorth = await updateStocks(email);
    const newNetWorth = await addNetWorth(email, newTotalNetWorth);
    const newTotalInvested = await incrementTotalInvested(
      email,
      -parsedAmount * stock.prevClose,
    );

    res.json({
      stocks: updatedUser.stocks,
      netWorth: newNetWorth,
      totalInvested: newTotalInvested,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}
