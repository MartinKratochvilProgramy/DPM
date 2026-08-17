import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import YahooFinance from 'yahoo-finance2';

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

    const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

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
