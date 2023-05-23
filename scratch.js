const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createNetWorthWrite () {
  const netWorth = await prisma.netWorth.findUnique({
    where: {
      email: 'martvil96@gmail.com'
    },
    include: {
      netWorthHistory: true
    }
  })

  return netWorth
}

createNetWorthWrite()
  .then((result) => {
    console.log('Net worth updated:', result)
  })
  .catch((error) => {
    console.error('Error updating Net worth:', error)
  })
