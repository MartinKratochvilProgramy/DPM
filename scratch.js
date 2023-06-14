const array1 = [
  { ticker: 'AAPL', price: 100, date: '2022-01-01' },
  { ticker: 'GOOG', price: 200, date: '2022-02-01' },
  { ticker: 'MSFT', price: 150, date: '2022-03-01' }
]

const array2 = [
  { ticker: 'AAPL', price: 1100 },
  { ticker: 'GOOG', price: 2200 },
  { ticker: 'MSFT', price: 1600 }
]

const updatedArray = array1.map(obj1 => {
  const obj2 = array2.find(obj => obj.ticker === obj1.ticker)
  if (obj2) {
    return { ...obj1, price: obj2.price }
  }
  return obj1
})

console.log(updatedArray)
