import { Schema, model, models } from 'mongoose'

const totalInvestedHistorySchema = new Schema({
  username: String,
  totalInvestedHistory: [
    {
      date: String,
      total: Number
    }
  ]
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const TotalInvestedHistory = models.TotalInvestedHistory || model('TotalInvestedHistory', totalInvestedHistorySchema)
export default TotalInvestedHistory
