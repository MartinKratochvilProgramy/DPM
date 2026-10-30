import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { updateStocks } from '@/utils/api/updateStocks';
import { addNetWorth } from '@/utils/api/addNetWorth';
import { incrementTotalInvested } from '@/utils/api/incrementTotalInvested';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email, ticker, purchaseId, amountToDelete } = req.body;
    const parsedPurchaseId = Number(purchaseId);
    const parsedAmount = Number(amountToDelete);

    if (email === 'demo') {
      res.status(500).json('Cannot edit in demo mode');
      return;
    }

    if (!Number.isInteger(parsedPurchaseId)) {
      res.status(400).json('Invalid purchase');
      return;
    }

    if (!Number.isInteger(parsedAmount) || parsedAmount === 0) {
      res.status(400).json('Invalid amount');
      return;
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: parsedPurchaseId,
      },
      include: {
        stock: true,
      },
    });

    if (
      purchase === null ||
      purchase.stock.userEmail !== email ||
      purchase.stock.ticker !== ticker
    ) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Purchase not found: ${email} ${ticker} ${purchaseId}`);
    }

    if (
      Math.sign(parsedAmount) !== Math.sign(purchase.amount) ||
      Math.abs(parsedAmount) > Math.abs(purchase.amount)
    ) {
      res.status(400).json('Cannot remove more than the purchase amount');
      return;
    }

    if (parsedAmount > purchase.stock.amount) {
      res.status(400).json('Cannot remove more than the current amount');
      return;
    }

    const remainingPurchaseAmount = purchase.amount - parsedAmount;

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (remainingPurchaseAmount === 0) {
        await tx.purchase.delete({
          where: {
            id: purchase.id,
          },
        });
      } else {
        await tx.purchase.update({
          where: {
            id: purchase.id,
          },
          data: {
            amount: remainingPurchaseAmount,
          },
        });
      }

      const updatedStock = await tx.stock.update({
        where: {
          id: purchase.stockId,
        },
        data: {
          amount: {
            decrement: parsedAmount,
          },
        },
        include: {
          purchases: true,
        },
      });

      if (updatedStock.amount <= 0) {
        await tx.purchase.deleteMany({
          where: {
            stockId: updatedStock.id,
          },
        });

        await tx.stock.delete({
          where: {
            id: updatedStock.id,
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
      -parsedAmount * purchase.price,
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
