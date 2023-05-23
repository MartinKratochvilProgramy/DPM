const date = new Date('2023-05-22T17:33:38.208Z')
const formattedDate = date.toLocaleString('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})

console.log(formattedDate)
