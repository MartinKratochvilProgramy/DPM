import { type StockInterface } from '@/types/client/stock';

type StockPrices = Record<string, number>;

export function updatePrices(
  oldStocks: StockInterface[],
  newPrices: StockPrices,
) {
  // map prices from newPrices to oldStocks based on ticker

  oldStocks.forEach((data) => {
    const ticker = data.ticker;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (newPrices[ticker]) {
      data.prevClose = newPrices[ticker];
    }
  });

  return oldStocks;
}
