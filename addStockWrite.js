const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main () {
  const userEmail = 'martvil96@gmail.com' // Replace with the actual user's email

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    include: {
      stocks: true
    }
  })

  console.log(user.stocks)

  // const purchases = await prisma.purchases.findMany({
  //   where: {
  //     userEmail,
  //     ticker: 'AAPL'
  //   }
  // })

  // console.log('Purchases:', purchases)

  if (user != null) {
    // await addStock({ ticker: 'MSFT', amount: 1, prevClose: 152 }, userEmail)

    // add new purchaseHistory

    // const purchaseHistoryTicker = 'AAPL' // Replace with the actual purchase history ticker value
    // const userEmail = 'martvil96@gmail.com' // Replace with the actual user's email

    // const purchase = await prisma.purchase.create({
    //   data: {
    //     date: new Date(),
    //     amount: 5,
    //     currentPrice: 155.5,
    //     totalAmount: 777.5,
    //     purchaseHistory: {
    //       connect: { ticker: purchaseHistoryTicker }
    //     },
    //     user: {
    //       connect: { email: userEmail }
    //     },
    //     purchaseHistoryticker: purchaseHistoryTicker
    //   }
    // })
  } else {
    console.log('User not found.')
  }

  await prisma.$disconnect()
}

main()
// addStock({ ticker: 'AMZN', amount: 1, prevClose: 152 }, 'martvil96@gmail.com')

async function addStock (newStock, userEmail) {
  const existingStocks = await prisma.stocks.findMany({
    where: {
      userEmail,
      ticker: newStock.ticker
    }
  })

  if (existingStocks.length === 0) {
    // create new stock
    await prisma.stocks.create({
      data: {
        ticker: newStock.ticker,
        amount: newStock.amount,
        prevClose: newStock.prevClose,
        user: {
          connect: { email: userEmail }
        }
      }
    })
  } else {
    // increment existing stock
    await prisma.user.update({
      where: {
        email: userEmail
      },
      data: {
        stocks: {
          updateMany: [
            {
              where: {
                ticker: newStock.ticker
              },
              data: {
                amount: existingStocks[0].amount + newStock.amount, // Updated amount value
                prevClose: 160.5 // Updated prevClose value
              }
            }
          ]
        }
      },
      include: {
        stocks: true
      }
    })
  }

  await prisma.purchases.create({
    data: {
      ticker: 'MSFT',
      date: new Date(),
      amount: 5,
      currentPrice: 160.5,
      totalAmount: 802.5,
      user: {
        connect: { email: userEmail }
      }
    }
  })
}
