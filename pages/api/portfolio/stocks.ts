import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yahooFinance = require('yahoo-finance2').default;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = JSON.parse(req.body);

    const stocks = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        stocks: {
          include: {
            purchases: {
              orderBy: {
                date: 'desc',
              },
            },
          },
        },
      },
    });

    if (stocks == null) {
      res.status(404);
      res.json({
        message: 'Stocks not found',
      });
      return;
    }

    // add financials to stocks
    const extendedStocks = await Promise.all(
      stocks.stocks.map(async (stock) => {
        const res = await yahooFinance.quote(stock.ticker); // Await the result of each quote
        const dividendRatePercent =
          (res.dividendRate / res.regularMarketPrice) * 100;
        return {
          ...stock,
          trailingPE: res.trailingPE ?? 0,
          forwardPE: res.forwardPE ?? 0,
          regularMarketChangePercent: res.regularMarketChangePercent ?? 0,
          fiftyTwoWeekChangePercent: res.fiftyTwoWeekChangePercent ?? 0,
          dividendRatePercent: isNaN(dividendRatePercent)
            ? 0
            : dividendRatePercent,
          quoteType: res.quoteType,
        };
      }),
    );

    res.json(extendedStocks);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}
