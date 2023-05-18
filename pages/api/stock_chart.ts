import { type NextApiRequest, type NextApiResponse } from 'next'
import getTickerChartData from '@/utils/server/getTickerChartData'

// eslint-disable-next-line @typescript-eslint/naming-convention
export default async function (req: NextApiRequest, res: NextApiResponse) {
  // send stocks to client
  const { period, ticker } = req.body

  try {
    const chartData = await getTickerChartData(ticker, period)

    res.json(chartData)
  } catch (error) {
    res.status(500).json({ error })
  }
};
