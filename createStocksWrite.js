const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateStocks (data) {
  const createdStocks = await prisma.stocks.create({
    data: {
      email: 'martvil96@gmail.com',
      currency: 'CZK',
      stocks: {
        create: []
      }
    }
  })

  return createdStocks
}

// Usage example:
const jsonData = {
  // JSON data
}

updateStocks(jsonData)
  .then((result) => {
    console.log('Stocks updated:', result)
  })
  .catch((error) => {
    console.error('Error updating stocks:', error)
  })
