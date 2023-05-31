export async function addRelativeChange (email: string, newValue: number) {
  // increase last net worth history if is the same date
  // else create new write new
  // const netWorthHistory: TimeDependetNumber[] = await NetWorthHistory.findOne({ username }).exec()

  const relativeChange = await prisma.relativeChange.findUnique({
    where: {
      email
    }
  })

  if (relativeChange === null) {
    throw new Error('netWorth not found')
  }

  let lastRelativeChange: number
  if (relativeChange.relativeChangeValues.length === 0) {
    lastRelativeChange = 1
  } else {
    lastRelativeChange = relativeChange.relativeChangeValues.at(-1)
  }

  const newRelativeChange = await prisma.relativeChange.update({
    where: {
      email
    },
    data: {
      relativeChangeDates: {
        push: new Date()
      },
      relativeChangeValues: {
        push: parseFloat((lastRelativeChange * newValue).toFixed(2))
      }
    }
  })

  return newRelativeChange
}
