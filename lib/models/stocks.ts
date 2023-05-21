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
  ]
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const Stocks = models.Stocks || model('Stocks', stocksSchema)
export default Stocks
