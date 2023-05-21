import { type Currency } from '@/types/api/currency'
import fetch from 'node-fetch'

export const getConversionRate = async (
  stockCurrency: string,
  userCurrency: Currency
): Promise<number> => {
  // get conversion rate from set currency -> user currency
  // if stock currency === user settings currency, conversion is 1
  let conversionRate = 1
  if (stockCurrency === userCurrency) {
    conversionRate = 1
  } else {
    const conversionRateSrc = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${stockCurrency}${userCurrency}=X`)
    const conversionRateJson: any = await conversionRateSrc.json()
    conversionRate = conversionRateJson.chart.result[0].meta.previousClose
  }
  return conversionRate
}
