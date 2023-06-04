const fs = require('fs')

// Read the contents of the .json file
fs.readFile('./dbSource/totalInvestedHistory.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  try {
    // Parse the JSON data into an object
    const obj = JSON.parse(data)
    const netWorth = obj.totalInvestedHistory

    const netWorthHistory = []

    for (const val of netWorth) {
      console.log(val.date, val.total)
      data = { totalInvestedDates: val.date, totalInvestedValues: parseFloat(val.total.toFixed(2)) }
      netWorthHistory.push(data)
    }
    fs.writeFile('./dbSource/totalInvestedHistoryParsed.json', JSON.stringify(netWorthHistory), 'utf8', (err) => {
      if (err) {
        console.error(err)
      }
    })
  } catch (err) {
    console.error('Error parsing JSON:', err)
  }
})
