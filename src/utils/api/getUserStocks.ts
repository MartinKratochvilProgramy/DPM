import { type FormattedStockInterface } from '@/types/api/stock'
import prisma from '@/lib/prisma'

export const getUserStocks = async (username: string): Promise<FormattedStockInterface[] | null> => {
  // returns array of formatter user stocks
  // [{ticker, amount, prevClose, _id, firstPurchase, lastPurchase}]

  const user = await prisma.user.findUnique({
    where: {
      email: username
    },
    include: {
      stocks: true,
      purchases: true
    }
  })

  const foundStocks = user.stocks

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (foundStocks) {
    const stocks = foundStocks.stocks
    const purchaseHistory = foundStocks.purchaseHistory

    const result: FormattedStockInterface[] = []

    for (let i = 0; i < stocks.length; i++) {
      // construct array of stock objects {ticker, amount, prevClose, _id, firstPurchase, lastPurchase}
      const ticker = stocks[i].ticker
      const index = purchaseHistory.findIndex((stock: FormattedStockInterface) => stock.ticker === ticker) // index of ticker in purchaseHistory

      const stockObject: FormattedStockInterface = {
        ticker: stocks[i].ticker,
        amount: stocks[i].amount,
        prevClose: stocks[i].prevClose,
        firstPurchase: purchaseHistory[index].purchases[0].date,
        lastPurchase: purchaseHistory[index].purchases[purchaseHistory[index].purchases.length - 1].date,
        purchaseHistory: purchaseHistory[index].purchases
      }

      result.push(stockObject)
    }

    return result
  } else {
    return null
  }
}
