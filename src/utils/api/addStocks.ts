import Stocks from '@/lib/models/stocks'
import NetWorthHistory from '@/lib/models/netWorthHistory'
import TotalInvestedHistory from '@/lib/models/totalInvestedHistory'
import { getCurrentDate } from './getCurrentDate'
import { type StocksInterface } from '@/types/api/stock'
import { type TimeDependetNumber } from '@/types/api/TimeDependetNumber'

export const createNewStock = async (
  username: string,
  ticker: string,
  amount: number,
  value: number
) => {
  const today = getCurrentDate()

  // if no stock history (first commit), create new object
  await Stocks.create({
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
    }]
  })

  await increaseNetWorth(username, today, value * amount)
  await increaseTotalInvestedHistory(username, today, value * amount)
}

export const addToExistingStock = async (
  username: string,
  stocks: StocksInterface,
  ticker: string,
  amount: number,
  value: number
) => {
  const today = getCurrentDate()

  // if stock history, push to existing db
  const stockIndex = stocks.stocks.map((item) => item.ticker).indexOf(ticker) // index of given ticker, if not exists, stockIndex = 1
  if (stockIndex === -1) {
    // stock ticker does not exist, push new
    stocks.stocks.push({
      ticker,
      amount,
      prevClose: value
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

  await increaseNetWorth(username, today, value * amount)
  await increaseTotalInvestedHistory(username, today, value * amount)

  const newStocks = new Stocks(stocks)
  await newStocks.save()
}

async function increaseNetWorth (username: string, today: string, amount: number) {
  // increase last net worth history if is the same date
  // else create new write new
  const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  if (netWorthHistory[netWorthHistory.length - 1].date === today) {
    netWorthHistory[netWorthHistory.length - 1].netWorth += parseFloat((amount).toFixed(2))
  } else {
    const newNetWorth = netWorthHistory[netWorthHistory.length - 1].netWorth + parseFloat((amount).toFixed(2))
    netWorthHistory.push({
      date: today,
      netWorth: newNetWorth
    })
  }
  const newNetWorthHistory = new NetWorthHistory(netWorthHistory)
  await newNetWorthHistory.save()
}

async function increaseTotalInvestedHistory (username: string, today: string, amount: number) {
  const totalInvestedHistory: TimeDependetNumber[] = await TotalInvestedHistory.findOne({ username }).exec()

  if (totalInvestedHistory[totalInvestedHistory.length - 1].date === today) {
    totalInvestedHistory[totalInvestedHistory.length - 1].netWorth += parseFloat((amount).toFixed(2))
  } else {
    const newNetWorth = totalInvestedHistory[totalInvestedHistory.length - 1].netWorth + parseFloat((amount).toFixed(2))
    totalInvestedHistory.push({
      date: today,
      netWorth: newNetWorth
    })
  }
  const newTotalInvestedHistory = new TotalInvestedHistory(totalInvestedHistory)
  await newTotalInvestedHistory.save()
}
