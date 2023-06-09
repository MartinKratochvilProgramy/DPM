import React, { useState } from 'react'
import { type StockInterface } from '@/types/client/stock'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatStocks } from '@/utils/client/formatStocks'
import { OrderDropDown } from './Stocks/OrderDropdown'
import { Stock } from './Stocks/Stock'
import { handleErrors } from '@/utils/client/handleErrors'
import { sortStocks } from '@/utils/client/sortStocks'

interface Props {
  stocks: StockInterface[]
  orderDropdownValue: string
  setOrderDropdownValue: (orderDropdownValue: string) => void
  setStocks: (stocks: StockInterface[]) => void
  setError: (error: string) => void
}

export const Stocks: React.FC<Props> = ({
  stocks,
  orderDropdownValue,
  setOrderDropdownValue,
  setStocks,
  setError
}) => {
  const [searchKey, setSearchKey] = useState('')

  const { user } = useUser()

  function deleteStock (ticker: string) {
    // hit the endpoint and write to db
    fetch('api/delete_stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email,
        ticker
      })
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((stocks) => {
        formatStocks(stocks)
        setStocks(stocks)
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  function deletePurchase (ticker: string, purchaseId: number) {
    // hit the endpoint and write to db
    fetch('api/delete_purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email,
        ticker,
        purchaseId
      })
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((stocks) => {
        formatStocks(stocks)
        setStocks(stocks)
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  function handleDropdownClick (value: string) {
    sortStocks(value, stocks)
    setOrderDropdownValue(value)
  }

  return (
    <div
      className="flex flex-col w-full h-full p-1 sm:p-6"
      id='stocks-output'
    >
      <div className='flex justify-start mb-2 space-x-2'>
        <OrderDropDown
          values={['NEWEST', 'OLDEST', 'VALUE HIGH', 'VALUE LOW', 'CHANGE HIGH', 'CHANGE LOW', 'A-Z', 'Z-A']}
          handleClick={handleDropdownClick}
          theme={'dark'}
          orderDropdownValue={orderDropdownValue}
          setOrderDropdownValue={setOrderDropdownValue}
        />
        <input
          onChange={(e) => { setSearchKey(e.target.value) }}
          onClick={(e) => { e.stopPropagation() }}
          className='w-[105px] shadow-sm px-3 py-0 sm:py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          type="text"
          placeholder='Search...' />
      </div>
      <div className='flex flex-col pr-2 overflow-y-auto'>
        {stocks.map((stock: StockInterface) => {
          if (stock.ticker.includes(searchKey.toUpperCase())) {
            return (
              <Stock
                stock={stock}
                key={stock.ticker}
                deleteStock={deleteStock}
                deletePurchase={deletePurchase}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
