import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createUserWithStockAndPurchases () {
  try {
    // const user = await prisma.user.create({
    //   data: {
    //     email: 'example@example.com',
    //     currency: 'USD',
    //     stocks: {
    //       create: {
    //         ticker: 'AAPL',
    //         amount: 10,
    //         prevClose: 135.5,
    //         firstPurchase: new Date(),
    //         lastPurchase: new Date(),
    //         purchases: {
    //           create: [
    //             {
    //               date: new Date(),
    //               amount: 5,
    //               price: 130.25
    //             },
    //             {
    //               date: new Date(),
    //               amount: 5,
    //               price: 132.75
    //             }
    //           ]
    //         }
    //       }
    //     }
    //   },
    //   include: {
    //     stocks: {
    //       include: {
    //         purchases: true
    //       }
    //     }
    //   }
    // })

    const stocks = await prisma.stock.findMany({
      where: {
        userEmail: 'martvil96@gmail.com',
        ticker: 'AAPL'
      },
      include: {
        purchases: true
      }
    })

    const purchases = await prisma.purchase.findMany({
      where: {
        stockId: 7
      }
    })

    console.log('Created user:', purchases)
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUserWithStockAndPurchases().catch(e => {
  console.log(e)
})
