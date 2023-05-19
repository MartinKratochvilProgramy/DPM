import { Stocks } from '../models/stocks'
import { getUserStocks } from '@/utils/api/getUserStocks'
import { type NextApiResponse } from 'next'
import { type PurchaseHistoryInterface, type StockInterface, type PurchaseInterface } from '@/types/api/stock'

export const stockRemove = async (
  username: string,
  ticker: string,
  newAmount: number,
  res: NextApiResponse
) => {
  const stocks = await getUserStocks(username)
  const currentAmount = stocks.stocks[stocks.stocks.findIndex((stock: StockInterface) => stock.ticker === ticker)].amount

  let newStocks
  if (newAmount === 0) {
    newStocks = stocks.stocks.filter((stock: StockInterface) => stock.ticker !== ticker)
  } else if (newAmount > 0) {
    newStocks = stocks.stocks
    const objIndex = stocks.stocks.findIndex((stocks: StockInterface) => stocks.ticker === ticker)
    newStocks[objIndex].amount = newAmount
  }

  let newPurchaseHistory: PurchaseHistoryInterface[]
  if (newAmount <= 0) {
    // if newAmount 0, remove stock all-together
    newPurchaseHistory = stocks.purchaseHistory.filter((purchase: PurchaseHistoryInterface) => purchase.ticker !== ticker)
  } else if (newAmount > 0) {
    // if nonzero new amount, first find purchase history of a given ticker
    const purchasesIndex = stocks.purchaseHistory.findIndex((purchase: PurchaseHistoryInterface) => purchase.ticker === ticker)
    newPurchaseHistory = stocks.purchaseHistory[purchasesIndex].purchases

    const amtToRemove = currentAmount - newAmount
    let count = 0
    const result: PurchaseInterface[] = []

    // unless the count is higher than amtToRemove, ignore purchases
    for (let i = 0; i < newPurchaseHistory.length; i++) {
      const newPurchase = newPurchaseHistory[i]

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
  if (newPurchaseHistory === undefined) {
    return 'Could not set newPurchaseHistory'
  }

  stocks.stocks = newStocks
  stocks.purchaseHistory = newPurchaseHistory

  await stocks.save()

  return 'success'
}
