import { type NextApiRequest, type NextApiResponse } from 'next'
import NetWorthHistory from '@/lib/models/netWorthHistory'
import connectMongo from '@/lib/mongodb'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body

  await connectMongo()
  const history = await NetWorthHistory.findOne({ username }).exec()

  console.log(history)

  res.json(history)
};
