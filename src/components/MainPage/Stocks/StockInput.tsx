import React, { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { type StockInterface } from '@/types/client/stock'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'
import { handleErrors } from '@/utils/client/handleErrors'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import '../../../app/globals.css'
import TickerHint from './TickerHint'

interface Props {
  setStocks: (stocks: StockInterface[]) => void
  setOrderDropdownValue: (orderDropdownValue: string) => void
  error: string
  setError: (error: string) => void
  setNetWorthDates: (netWorthDates: Date[]) => void
  setNetWorthValues: (netWorthValues: number[]) => void
  setTotalInvestedDates: (totalInvestedDates: Date[]) => void
  setTotalInvestedValues: (totalInvestedValues: number[]) => void
}

interface StockI {
  ticker: string
  amount: number
}

export interface TickerHintI {
  symbol: string
  name: string
}

export const StockInput: React.FC<Props> = ({
  setStocks,
  setOrderDropdownValue,
  error,
  setError,
  setNetWorthDates,
  setNetWorthValues,
  setTotalInvestedDates,
  setTotalInvestedValues
}) => {
  const [selectedTicker, setSelectedTicker] = useState('')
  const [stockAmount, setStockAmount] = useState(0)
  const [fetchingData, setFetchingData] = useState(false)
  const [tickerHints, setTickerHints] = useState<TickerHintI[]>([])

  const { user } = useUser()

  function persist (newStock: StockI) {
    setFetchingData(true)
    setTickerHints([])

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

        setTotalInvestedDates(res.totalInvested.totalInvestedDates)
        setTotalInvestedValues(res.totalInvested.totalInvestedValues)

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

  function getTickerHints () {
    fetch('api/get_ticker_hints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticker: selectedTicker
      })

    })
      .then(handleErrors)
      .then(async response => response.json())
      .then(res => {
        setTickerHints(res.tickers)
      })
      .catch(e => {
        console.log(e)
      })
  }

  function addStock (e: React.FormEvent<HTMLFormElement>) {
    // get stock ticker, amount and send to server
    e.preventDefault()
    setError('')

    if (selectedTicker === '') {
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
    const newStock = { ticker: selectedTicker, amount: stockAmount }
    persist(newStock)

    setSelectedTicker('')
    setStockAmount(0)
  }

  function onTickerInputChange (e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    e.target.classList.remove('border-red-400')
    e.target.classList.remove('border-[1px]')
    e.target.classList.add('border-gray-300')
    setSelectedTicker(e.target.value)

    if (e.target.value.length > 1) {
      getTickerHints()
    } else {
      setTickerHints([])
    }
  }

  function onAmountInputChange (e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    e.target.classList.remove('border-red-400')
    e.target.classList.remove('border-[1px]')
    e.target.classList.add('border-gray-300')
    setStockAmount(parseInt(e.target.value))
  }

  return (
    <div className="w-full z-10">
      <form
        onSubmit={(e) => { addStock(e) }}
        className="flex flex-col  items-center">
        <label htmlFor="add-stock" className="sr-only">Add stock</label>
        <h1 className='text-3xl playfair font-semibold mb-4 text-black dark:text-white'>
          ADD NEW <span className='text-blue-600'>STOCK</span>
        </h1>
        <div className="relative flex rounded-md border border-gray-300 bg-white flex-row w-10/12 md:w-5/12 lg:w-3/12 h-full">
          <label htmlFor="ticker" className="sr-only">Ticker input</label>
          <input
            type="text"
            id="ticker-input"
            className="bg-gray-100 w-full rounded-l-md text-gray-900 text-sm focus:outline-none block pl-4 p-2.5"
            placeholder="Ticker ('AAPL', 'MSFT', ... )"
            onChange={onTickerInputChange}
            value={selectedTicker}
          />

          <label htmlFor="amount" className="sr-only">Amount input</label>
          <input
            type="number"
            id="amount-input"
            className="text-center rounded-r-md bg-gray-100 w-5/12 border-0 border-l-[1px] border-gray-300 text-gray-900 text-sm focus:outline-none block pl-4 p-2.5"
            placeholder="Amount..."
            onChange={(e) => { onAmountInputChange(e) }}
            value={stockAmount}
          />

          <div className='absolute left-0 bottom-0 translate-y-[100%] mt-2 rounded border border-red-200 overflow-none text-black'>
            {tickerHints.map(tickerHint => {
              return (
                <TickerHint key={tickerHint.symbol} tickerHint={tickerHint} />
              )
            })}
          </div>

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
              className="flex flex-row mt-2 px-7 py-3 text-white bg-blue-600 font-medium text-sm leading-snug uppercase rounded-md whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
              Add stock
            </button>
          }
        </div>
      </form>

    </div>
  )
}
