export interface PurchaseInterface {
  amount: number
  price: number
  date: Date
  relativeChange: number
  totalAmount: number
  id: number
}

export interface StockInterface {
  amount: number
  avgPercentageChange: number
  firstPurchase: string
  lastPurchase: string
  prevClose: number
  purchases: PurchaseInterface[]
  ticker: string
}

export type TimePeriod = '6m' | '1y' | '2y' | '5y'
