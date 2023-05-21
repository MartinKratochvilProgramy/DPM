import { type Currency } from '@/types/api/currency'
import { Schema, model, models } from 'mongoose'

const stocksSchema = new Schema({
  username: String,
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'CZK'] as Currency[],
    default: 'USD'
  },
  stocks: [
    {
      ticker: String,
      amount: Number,
      prevClose: Number
    }
  ],
  purchaseHistory: [
    {
      ticker: String,
      purchases: [
        {
          date: String,
          amount: Number,
          currentPrice: Number,
          totalAmount: Number
        }
      ]
    }
  ],
  netWorthHistory: [
    {
      date: String,
      netWorth: Number
    }
  ],
  relativeChangeHistory: [
    {
      date: String,
      relativeChange: Number
    }
  ],
  totalInvestedHistory: [
    {
      date: String,
      total: Number
    }
  ]
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const Stocks = models.Stocks || model('stocks', stocksSchema)
export default Stocks
