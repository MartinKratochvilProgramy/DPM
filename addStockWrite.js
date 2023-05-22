const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main () {
  const userEmail = 'martvil96@gmail.com' // Replace with the actual user's email

  const user = await prisma.stocks.findUnique({
    where: {
      email: userEmail
    },
    include: {
      stocks: {
        include: {
          purchases: true
        }
      }
    }
  })

  console.log(user.stocks[0].purchases)

  // const existingStocks = await prisma.stocks.findUnique({
  //   where: {
  //     email: userEmail
  //   },
  //   include: {
  //     stocks: {
  //       where: {
  //         ticker: 'AAPL'
  //       }
  //     }
  //   }
  // })

  // console.log('existingStocks', existingStocks.stocks.length)

  // const purchases = await prisma.purchases.findMany({
  //   where: {
  //     userEmail,
  //     ticker: 'AAPL'
  //   }
  // })

  // console.log('Purchases:', purchases)

  if (user != null) {
    // await addStock({ ticker: 'AMZN', amount: 1, prevClose: 152 }, userEmail)

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
  const existingStocks = await prisma.stocks.findUnique({
    where: {
      email: userEmail
    },
    include: {
      stocks: {
        where: {
          ticker: newStock.ticker
        }
      }
    }
  })

  console.log(existingStocks)

  if (existingStocks.stocks.length === 0) {
    // create new stock
    const stock = await prisma.stocks.update({
      where: {
        email: userEmail
      },
      data: {
        stocks: {
          create: {
            ticker: newStock.ticker,
            amount: newStock.amount,
            prevClose: newStock.prevClose,
            firstPurchase: new Date(),
            lastPurchase: new Date(),
            purchases: {
              create: [
                {
                  date: new Date(),
                  amount: newStock.amount,
                  price: newStock.prevClose
                }
              ]
            }
          }
        }
      },
      include: {
        stocks: {
          include: {
            purchases: true
          }
        }
      }
    })

    console.log('Stock added:', stock)
  } else {
    // increment existing stock
    const updatedStocks = await prisma.user.update({
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
    console.log('Updated stocks', updatedStocks)
  }

  // await prisma.purchases.create({
  //   data: {
  //     ticker: 'MSFT',
  //     date: new Date(),
  //     amount: 5,
  //     currentPrice: 160.5,
  //     totalAmount: 802.5,
  //     user: {
  //       connect: { email: userEmail }
  //     }
  //   }
  // })
}
