import { type Currency } from './currency'

export interface TotalInvestedHistoryInterface {
  date: string
  total: number
}

export interface FormattedStockInterface {
  ticker: string
  amount: number
  prevClose: number
  firstPurchase: string
  lastPurchase: string
  purchaseHistory: PurchaseInterface[]
}

export interface StocksInterface {
  email: string
  currency: Currency
  stocks: FormattedStockInterface[]
}

export interface StockInterface {
  ticker: string
  amount: number
  prevClose: number
}

export interface PurchaseHistoryInterface {
  ticker: string
  purchases: PurchaseInterface[]
}

export interface PurchaseInterface {
  date: string
  amount: number
  currentPrice: number
  totalAmount: number
}
