import { Schema, model, models } from 'mongoose'

const netWorthHistorySchema = new Schema({
  username: String,
  netWorthHistory: [
    {
      date: String,
      netWorth: Number
    }
  ]
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const NetWorthHistory = models.NetWorthHistory || model('netWorthHistory', netWorthHistorySchema)
export default NetWorthHistory
