import React, { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { type StockInterface } from '@/types/client/stock'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'
import { handleErrors } from '@/utils/client/handleErrors'
import '../../../app/globals.css'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface Props {
  setStocks: (stocks: StockInterface[]) => void
  setOrderDropdownValue: (orderDropdownValue: string) => void
  error: string
  setError: (error: string) => void
  setNetWorthDates: (netWorthDates: Date[]) => void
  setNetWorthValues: (netWorthValues: number[]) => void
}

interface Stock {
  ticker: string
  amount: number
}

export const StockInput: React.FC<Props> = ({
  setStocks,
  setOrderDropdownValue,
  error,
  setError,
  setNetWorthDates,
  setNetWorthValues
}) => {
  const [stockTicker, setStockTicker] = useState('')
  const [stockAmount, setStockAmount] = useState(0)
  const [fetchingData, setFetchingData] = useState(false)

  const { user } = useUser()

  function persist (newStock: Stock) {
    setFetchingData(true)

    // hit the endpoint and write to db
    // returns the new stocks array
    fetch('api/add_stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email,
        stockItems: newStock,
        settingsCurrency: 'CZK'
      })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((res) => {
        setNetWorthDates(res.netWorth.netWorthDates)
        setNetWorthValues(res.netWorth.netWorthValues)

        const stocks = res.stocks

        formatStocks(stocks)

        setOrderDropdownValue('NEWEST')
        sortStocks('NEWEST', stocks)

        setStocks(stocks)
        setFetchingData(false)
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  function addStock (e: React.FormEvent<HTMLFormElement>) {
    // get stock ticker, amount and send to server
    e.preventDefault()
    setError('')

    if (stockTicker === '') {
      const tickerInput = document.getElementById('ticker-input')
      if (tickerInput === null) return
      tickerInput.classList.add('border-red-400')
      tickerInput.classList.add('border-[1px]')
      tickerInput.classList.remove('border-gray-300')
      return
    }
    if (stockAmount <= 0) {
      const amountInput = document.getElementById('amount-input')
      if (amountInput === null) return
      amountInput.classList.add('border-red-400')
      amountInput.classList.add('border-[1px]')
      amountInput.classList.remove('border-gray-300')
      return
    }
    const newStock = { ticker: stockTicker, amount: stockAmount }
    persist(newStock)

    setStockTicker('')
    setStockAmount(0)
  }

  function onTickerInputChange (e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    e.target.classList.remove('border-red-400')
    e.target.classList.remove('border-[1px]')
    e.target.classList.add('border-gray-300')
    setStockTicker(e.target.value)
  }

  function onAmountInputChange (e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    e.target.classList.remove('border-red-400')
    e.target.classList.remove('border-[1px]')
    e.target.classList.add('border-gray-300')
    setStockAmount(parseInt(e.target.value))
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => { addStock(e) }}
        className="flex flex-col  items-center">
        <label htmlFor="add-stock" className="sr-only">Add stock</label>
        <h1 className='text-3xl playfair font-semibold mb-4 text-black dark:text-white'>
          ADD NEW <span className='text-blue-600'>STOCK</span>
        </h1>
        <div className="relative flex rounded-md overflow-hidden border border-gray-300 flex-row w-10/12 md:w-5/12 lg:w-3/12 h-full">
          <label htmlFor="ticker" className="sr-only">Ticker input</label>
          <input
            type="text"
            id="ticker-input"
            className="bg-gray-100 w-full text-gray-900 text-sm focus:outline-none block pl-4 p-2.5"
            placeholder="Ticker ('AAPL', 'MSFT', ... )"
            onChange={onTickerInputChange}
            value={stockTicker}
          />
          <label htmlFor="amount" className="sr-only">Amount input</label>
          <input
            type="number"
            id="amount-input"
            className="text-center rounded-r-md  bg-gray-100 w-5/12 border-0 border-l-[1px] border-gray-300 text-gray-900 text-sm focus:outline-none block pl-4 p-2.5"
            placeholder="Amount..."
            onChange={(e) => { onAmountInputChange(e) }}
            value={stockAmount}
          />
        </div>
        {error.length > 0 &&
          <div className='font-semibold text-xl text-red-600'>
            {error}
          </div>
        }
        <div className='flex items-center min-h-[56px]'>
          {fetchingData
            ? <LoadingSpinner size={32} />
            : <button
              type="submit"
              className="relative flex flex-row mt-2 px-7 py-3 text-white bg-blue-600 font-medium text-sm leading-snug uppercase rounded-md whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
              Add stock
            </button>
          }
        </div>
      </form>
    </div>
  )
}
