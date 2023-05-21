import { type PurchaseHistoryInterface, type StockInterface, type PurchaseInterface } from '@/types/api/stock'
import Stocks from '@/lib/models/stocks'
import connectMongo from '@/lib/mongodb'

export async function removeStock (
  username: string,
  ticker: string,
  newAmount: number
): Promise<string> {
  await connectMongo()

  const stocks = await Stocks.findOne({ username }).exec()
  const currentAmount = stocks.stocks[stocks.stocks.findIndex((stock: StockInterface) => stock.ticker === ticker)].amount

  let newStocks
  if (newAmount === 0) {
    newStocks = stocks.stocks.filter((stock: StockInterface) => stock.ticker !== ticker)
  } else if (newAmount > 0) {
    newStocks = stocks.stocks
    const objIndex = stocks.stocks.findIndex((stocks: StockInterface) => stocks.ticker === ticker)
    newStocks[objIndex].amount = newAmount
  }

  if (newAmount <= 0) {
    // if newAmount 0, remove stock all-together
    const newPurchaseHistory = stocks.purchaseHistory.filter((purchase: PurchaseHistoryInterface) => purchase.ticker !== ticker)
    stocks.purchaseHistory = newPurchaseHistory
  } else if (newAmount > 0) {
    // if nonzero new amount, first find purchase history of a given ticker
    const purchasesIndex = stocks.purchaseHistory.findIndex((purchase: PurchaseHistoryInterface) => purchase.ticker === ticker)
    const oldPurchases: PurchaseInterface[] = stocks.purchaseHistory[purchasesIndex].purchases

    const amtToRemove = currentAmount - newAmount
    let count = 0
    const result: PurchaseInterface[] = []

    // unless the count is higher than amtToRemove, ignore purchases
    for (let i = 0; i < oldPurchases.length; i++) {
      const newPurchase = oldPurchases[i]

      if (newPurchase.amount + count <= amtToRemove) {
        count += newPurchase.amount
      } else if (count < amtToRemove && amtToRemove < count + newPurchase.amount) {
        newPurchase.amount = newPurchase.amount - (amtToRemove - count)
        result.push(newPurchase)
        count += (amtToRemove - count)
      } else {
        result.push(newPurchase)
      }
    }

    stocks.purchaseHistory[purchasesIndex].purchases = result
  }

  if (newStocks === undefined) {
    return 'Could not set newStocks'
  }

  stocks.stocks = newStocks

  await stocks.save()

  return 'success'
}
