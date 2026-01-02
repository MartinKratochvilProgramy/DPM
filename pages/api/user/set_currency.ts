import { type NextApiRequest, type NextApiResponse } from 'next';
import { createDbWrite } from '@/utils/api/createDbWrite';
import prisma from '@/lib/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, selectedCurrency } = JSON.parse(req.body);

    const stocks = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (stocks === null) {
      await createDbWrite(email, selectedCurrency);
    } else {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          currency: selectedCurrency,
        },
      });
    }

    res.status(200).json({ selectedCurrency });
  } catch (error) {
    res.status(500).json({ message: `Error occured: ${String(error)}` });
  }
}
