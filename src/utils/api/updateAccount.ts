import prisma from '@/lib/prisma'
import { addNetWorth } from './addNetWorth'
import { addRelativeChange } from './addRelativeChange'
import { updateStocks } from './updateStocks'

export async function updateAccount (email: string) {
  // update each stock
  // update net worth and rel. change history
  try {
    const newTotalNetWorth = await updateStocks(email)
    await addNetWorth(email, newTotalNetWorth)
    const netWorth = await prisma.netWorth.findMany({
      where: {
        userEmail: email
      },
      orderBy: {
        date: 'asc'
      }
    })

    await addRelativeChange(email, netWorth[netWorth.length - 1].value / netWorth[netWorth.length - 2].value)
    return `Updated stocks for user ${email}`
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Error occured while updating stocks for user ${email}: ${error}`
  }
}
