import { type Stocks, type Stock, type Purchase } from '@prisma/client'

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
