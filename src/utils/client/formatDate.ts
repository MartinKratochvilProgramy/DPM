export function formatDate (date: string): string {
  const dateObject = new Date(date)
  const formattedDate = dateObject.toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit'
  })

  return formattedDate
}
