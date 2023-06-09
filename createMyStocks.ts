import { PrismaClient, type Stock, type Purchase } from '@prisma/client'

const prisma = new PrismaClient()

interface Stocks {
  email: string
  currency: string
  stocks: Stock[]
}

async function createStocks (stocksData: Stocks): Promise<Stocks> {
  return await prisma.stocks.create({ data: stocksData })
}

async function createStock (stockData: Stock): Promise<Stock> {
  return await prisma.stock.create({ data: stockData })
}

async function createPurchase (purchaseData: Purchase): Promise<Purchase> {
  return await prisma.purchase.create({ data: purchaseData })
}

// Usage example
async function main () {
  const stocksData: Stocks = {
    email: 'example@email.com',
    currency: 'USD',
    stocks: []
  }

  const stockData: Stock = {
    ticker: 'AAPL',
    amount: 10,
    prevClose: 150.25,
    firstPurchase: new Date('2022-01-01'),
    lastPurchase: new Date('2022-05-01'),
    stocksEmail: stocksData.email,
    purchases: [],
    Stocks: stocksData
  }

  const purchaseData: Purchase = {
    id: 1,
    date: new Date('2022-03-15'),
    amount: 5,
    price: 160.0,
    stockTicker: stockData.ticker,
    Stock: stockData
  }

  const createdStocks = await createStocks(stocksData)
  const createdStock = await createStock(stockData)
  const createdPurchase = await createPurchase(purchaseData)

  console.log('Created Stocks:', createdStocks)
  console.log('Created Stock:', createdStock)
  console.log('Created Purchase:', createdPurchase)
}

main()
  .catch((error) => {
    console.error(error)
  })
