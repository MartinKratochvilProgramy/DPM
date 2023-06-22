/* eslint-disable @typescript-eslint/restrict-plus-operands */
import yahooFinance from 'yahoo-finance2'

async function main () {
  const currentDate = new Date()

  // Extract year, month, and day
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1 // Months are zero-based, so we add 1
  const day = currentDate.getDate()

  // Format the values with leading zeros if necessary
  const formattedDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)

  console.log(formattedDate)

  const query = 'AAPL'
  const queryOptions = { period1: '2021-02-01', period2: new Date() }
  const result = await yahooFinance.historical(query, queryOptions)

  console.log(result)
}

main().catch(e => { console.log(e) })
