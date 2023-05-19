import { type FormattedStockInterface, type PurchaseHistoryInterface } from '@/types/api/stock'

export function formatStocks (foundStocks: any): FormattedStockInterface[] {
  // returns array of formatter user stocks
  // [{ticker, amount, prevClose, _id, firstPurchase, lastPurchase}]
  // returns [] on empty found stocks

  const stocks = foundStocks.stocks
  const purchaseHistory = foundStocks.purchaseHistory

  const result: FormattedStockInterface[] = []

  for (let i = 0; i < stocks.length; i++) {
    // construct array of stock objects {ticker, amount, prevClose, _id, firstPurchase, lastPurchase}
    const ticker = stocks[i].ticker
    const index = purchaseHistory.findIndex((stock: PurchaseHistoryInterface) => stock.ticker === ticker) // index of ticker in purchaseHistory

    const stockObject: FormattedStockInterface = {
      ticker: stocks[i].ticker,
      amount: stocks[i].amount,
      prevClose: stocks[i].prevClose,
      _id: stocks[i]._id,
      firstPurchase: purchaseHistory[index].purchases[0].date,
      lastPurchase: purchaseHistory[index].purchases[purchaseHistory[index].purchases.length - 1].date,
      purchaseHistory: purchaseHistory[index].purchases
    }

    result.push(stockObject)
  }

  return result
}
