import mongoose from 'mongoose'

const connectMongo = async () => {
  if (process.env.MONGODB_URI == null || process.env.MONGODB_URI === undefined) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  mongoose.connect(process.env.MONGODB_URI)
}

export default connectMongo
