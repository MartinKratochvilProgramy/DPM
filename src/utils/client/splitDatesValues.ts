interface TimeDependentValue {
  date: Date
  value: number
}

interface Res {
  dates: Date[]
  values: number[]
}

export function splitDatesValues (datesValues: TimeDependentValue[]): Res {
  const dates: Date[] = []
  const values: number[] = []

  for (const item of datesValues) {
    dates.push(item.date)
    values.push(item.value)
  }

  return {
    dates,
    values
  }
}
