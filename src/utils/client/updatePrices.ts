import { type StockInterface } from '@/types/client/stock'

interface StockPrices {
  ticker: string
  price: number
}

export function updatePrices (oldStocks: StockInterface[], newPrices: StockPrices[]) {
  // map prices from newPrices to oldStocks based on ticker

  const tickerPriceMap: any = {}
  newPrices.forEach((data) => {
    tickerPriceMap[data.ticker] = data.price
  })

  oldStocks.forEach((data) => {
    const ticker = data.ticker
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (tickerPriceMap[ticker]) {
      data.prevClose = tickerPriceMap[ticker]
    }
  })

  return oldStocks
}
