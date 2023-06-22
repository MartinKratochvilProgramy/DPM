import { type NextApiRequest, type NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ticker } = req.body

    const tickersInfo = await fetch(`https://finance.yahoo.com/_finance_doubledown/api/resource/searchassist;searchTerm=${String(ticker)}?device=console&returnMeta=true`)
    const tickersInfoJson: any = await tickersInfo.json()

    const tickers = tickersInfoJson.data.items.map((item: any) => {
      return { symbol: item.symbol, name: item.name }
    })

    res.json({ tickers })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
};
