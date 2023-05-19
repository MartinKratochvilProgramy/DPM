import clientPromise from '@/lib/mongodb'
import { getCurrentDate } from './getCurrentDate'
import { type StocksInterface, type StockInterface, type TotalInvestedHistoryInterface } from '@/types/api/stock'
import { v4 as uuidv4 } from 'uuid'

export async function createNewStock (
  username: string,
  ticker: string,
  amount: number,
  value: number
) {
  const today = getCurrentDate()

  const newStock = {
    username,
    stocks: [{
      ticker,
      amount,
      prevClose: value
    }],
    purchaseHistory: [{
      ticker,
      purchases: [
        {
          date: today,
          amount,
          currentPrice: value,
          totalAmount: (value * amount).toFixed(2)
        }
      ]
    }],
    netWorthHistory: [{
      date: today,
      netWorth: (value * amount).toFixed(2)
    }],
    relativeChangeHistory: [{
      date: today,
      relativeChange: 1
    }],
    totalInvestedHistory: [{
      date: today,
      total: (value * amount).toFixed(2)
    }]
  }

  const client = await clientPromise
  const db = client.db('portfolio')

  await db
    .collection('stocks')
    .insertOne(newStock)
}

export async function addToExistingStock (
  username: string,
  stocks: StocksInterface,
  ticker: string,
  amount: number,
  value: number
) {
  const today = getCurrentDate()

  // if stock history, push to existing db
  const stockIndex = stocks.stocks.map((item: StockInterface) => item.ticker).indexOf(ticker) // index of given ticker, if not exists, stockIndex = 1

  if (stockIndex === -1) {
    // stock ticker does not exist, push new
    stocks.stocks.push({
      ticker,
      amount,
      prevClose: value,
      _id: uuidv4()
    })
    stocks.purchaseHistory.push({
      ticker,
      purchases: [
        {
          date: today,
          amount,
          currentPrice: value,
          totalAmount: parseFloat((value * amount).toFixed(2))
        }
      ]
    })
  } else {
    // stock ticker exists, add amount to existing object
    stocks.stocks[stockIndex].amount += parseInt(amount.toString())
    stocks.purchaseHistory[stockIndex].purchases.push({
      date: today,
      amount,
      currentPrice: value,
      totalAmount: parseFloat((value * amount).toFixed(2))
    })
  }

  // increase total net worth by invested amount
  stocks.netWorthHistory.push({
    date: today,
    netWorth: parseFloat((stocks.netWorthHistory[stocks.netWorthHistory.length - 1].netWorth + (value * amount)).toFixed(2))
  })

  // add purchase to investments history
  const investedIndex = stocks.totalInvestedHistory.map((item: TotalInvestedHistoryInterface) => item.date).indexOf(today)
  if (investedIndex === -1) {
    // if no purchase was made today
    stocks.totalInvestedHistory.push({
      date: today,
      total: (stocks.totalInvestedHistory[stocks.totalInvestedHistory.length - 1].total + parseFloat((value * amount).toFixed(2)))
    })
  } else {
    // if purchase was made today, increment in existing date
    stocks.totalInvestedHistory[investedIndex].total += parseFloat((value * amount).toFixed(2))
  }

  const client = await clientPromise
  const db = client.db('portfolio')

  await db
    .collection('stocks')
    .replaceOne({ username }, stocks)
}
