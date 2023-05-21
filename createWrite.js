const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateStocks (data) {
  const stocks = [
    {
      ticker: 'AAPL',
      amount: 1,
      prevClose: 153.1
    }
  ]
  const purchaseHistory = [
    {
      ticker: 'AAPL',
      purchases: [
        {
          date: '12-01-2022',
          amount: 1,
          currentPrice: 153.1,
          totalAmount: 1
        }
      ]
    }
  ]

  const createdStocks = await prisma.stocks.create({
    data: {
      email: 'martvil96@gmail.com',
      currency: 'CZK',
      stocks: {
        create: stocks.map((stock) => ({
          ticker: stock.ticker,
          amount: stock.amount,
          prevClose: stock.prevClose
        }))
      },
      purchaseHistory: {
        create: purchaseHistory.map((history) => ({
          ticker: history.ticker,
          purchases: {
            create: history.purchases.map((purchase) => ({
              date: new Date(purchase.date),
              amount: purchase.amount,
              currentPrice: purchase.currentPrice,
              totalAmount: purchase.totalAmount
            }))
          }
        }))
      }
    },
    include: {
      stocks: true,
      purchaseHistory: {
        include: {
          purchases: true
        }
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
