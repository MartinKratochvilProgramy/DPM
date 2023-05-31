export async function addTotalInvested (email: string, newValue: number) {
  const newTotalInvested = await prisma.totalInvested.update({
    where: {
      email
    },
    data: {
      totalInvestedDates: {
        push: new Date()
      },
      totalInvestedValues: {
        push: parseFloat((newValue).toFixed(2))
      }
    }
  })

  return newTotalInvested
}
