import { type NextApiRequest, type NextApiResponse } from 'next'
import getTickerChartData from '@/utils/api/getTickerChartData'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // send stocks to client
    const { period, ticker } = req.body

    try {
      const chartData = await getTickerChartData(ticker, period)

      res.json(chartData)
    } catch (error) {
      res.status(500).json({ error })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
};
