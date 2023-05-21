import { Schema, model, models } from 'mongoose'

const relativeChangeHistorySchema = new Schema({
  username: String,
  relativeChangeHistory: [
    {
      date: String,
      relativeChange: Number
    }
  ]
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const RelativeChangeHistory = models.RelativeChangeHistory || model('RelativeChangeHistory', relativeChangeHistorySchema)
export default RelativeChangeHistory
