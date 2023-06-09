import { type Stocks, type Stock, type Purchase } from '@prisma/client'

const metaPurchases: Purchase[] = [
  {
    id: 1,
    date: new Date('2022-10-20'),
    amount: 4,
    price: 3343.34,
    stockTicker: 'META'
  }
]

export const stocksParsed: Stock[] = [
  {
    ticker: 'META',
    amount: 4,
    prevClose: 5985.43,
    firstPurchase: new Date('2022-10-20'),
    lastPurchase: new Date('2022-10-20'),
    purchases: [
    ]
  }
]
