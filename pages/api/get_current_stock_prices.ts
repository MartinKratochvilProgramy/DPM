import { type NextApiRequest, type NextApiResponse } from 'next';
import { getConversionRate } from '@/utils/client/getConversionRate';
import YahooFinance from 'yahoo-finance2';

type StockPrices = Record<string, number>;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tickers, currency } = req.body;

    const converstionRates: any = {};
    const result: StockPrices = {};

    const yahooFinance = new YahooFinance();

    // TODO: maybe this can be in one API call?
    for (const ticker of tickers) {
      // get stocks ticker, if not exists, return

      const r: Record<any, any> = await yahooFinance.quoteSummary(ticker);
      const regularMarketPrice = r?.price?.regularMarketPrice;
      const tickerCurrency = r?.price?.currency;

      if (!regularMarketPrice) {
        res.status(403);
        res.json({
          message: `Ticker not found: ${String(ticker)}`,
        });
        return;
      }

      if (converstionRates[tickerCurrency] === undefined) {
        converstionRates[tickerCurrency] = await getConversionRate(
          tickerCurrency,
          currency,
        );
      }

      // current price of stock in set currency
      const price = parseFloat(
        (regularMarketPrice * converstionRates[tickerCurrency]).toFixed(2),
      );

      result[ticker] = price;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}
