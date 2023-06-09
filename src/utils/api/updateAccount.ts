import { addNetWorth } from './addNetWorth'
import { addRelativeChange } from './addRelativeChange'
import { updateStocks } from './updateStocks'

export async function updateAccount (email: string) {
  // update each stock
  // update net worth and rel. change history
  try {
    const newTotalNetWorth = await updateStocks(email)
    const newNetWorth = await addNetWorth(email, newTotalNetWorth)
    await addRelativeChange(email, newNetWorth.netWorthValues[newNetWorth.netWorthValues.length - 1] / newNetWorth.netWorthValues[newNetWorth.netWorthValues.length - 1])
    return `Updated stocks for user ${email}`
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Error occured while updating stocks for user ${email}: ${error}`
  }
}
