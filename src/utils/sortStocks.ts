import { type StockInterface } from '@/types/client/stock'

export const sortStocks = (orderBy: string, stocksInput: StockInterface[]) => {
  if (orderBy === 'A-Z') {
    stocksInput.sort((a, b) => a.ticker.localeCompare(b.ticker))
  } else if (orderBy === 'Z-A') {
    stocksInput.sort((a, b) => b.ticker.localeCompare(a.ticker))
  } else if (orderBy === 'NEWEST') {
    stocksInput.sort(function (a, b) { return new Date(b.lastPurchase).getTime() - new Date(a.lastPurchase).getTime() })
  } else if (orderBy === 'OLDEST') {
    stocksInput.sort(function (a, b) { return new Date(a.firstPurchase).getTime() - new Date(b.firstPurchase).getTime() })
  } else if (orderBy === 'VALUE HIGH') {
    stocksInput.sort(function (a, b) { return b.prevClose * b.amount - a.prevClose * a.amount })
  } else if (orderBy === 'VALUE LOW') {
    stocksInput.sort(function (a, b) { return a.prevClose * a.amount - b.prevClose * b.amount })
  } else if (orderBy === 'CHANGE HIGH') {
    stocksInput.sort(function (a, b) { return b.avgPercentageChange - a.avgPercentageChange })
  } else if (orderBy === 'CHANGE LOW') {
    stocksInput.sort(function (a, b) { return a.avgPercentageChange - b.avgPercentageChange })
  }
}
