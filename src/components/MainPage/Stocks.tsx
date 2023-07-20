import React, { useState } from 'react'
import { type StockInterface } from '@/types/client/stock'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatStocks } from '@/utils/client/formatStocks'
import { OrderDropDown } from './Stocks/OrderDropdown'
import { Stock } from './Stocks/Stock'
import { handleErrors } from '@/utils/client/handleErrors'
import { sortStocks } from '@/utils/client/sortStocks'

interface Props {
  demo: boolean
  stocks: StockInterface[]
  orderDropdownValue: string
  setOrderDropdownValue: (orderDropdownValue: string) => void
  setStocks: (stocks: StockInterface[]) => void
  setError: (error: string) => void
  setStocksInputLoading: (stocksInputLoading: boolean) => void
  setNetWorthDates: (netWorthDates: Date[]) => void
  setNetWorthValues: (netWorthValues: number[]) => void
  setTotalInvestedDates: (totalInvestedDates: Date[]) => void
  setTotalInvestedValues: (totalInvestedValues: number[]) => void
}

export const Stocks: React.FC<Props> = ({
  demo,
  stocks,
  orderDropdownValue,
  setOrderDropdownValue,
  setStocks,
  setError,
  setStocksInputLoading,
  setNetWorthDates,
  setNetWorthValues,
  setTotalInvestedDates,
  setTotalInvestedValues
}) => {
  const [searchKey, setSearchKey] = useState('')

  const { user } = useUser()

  function deleteStock (ticker: string) {
    setStocksInputLoading(true)

    fetch('api/portfolio/delete_stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: demo ? 'demo' : user?.email,
        ticker
      })
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((res) => {
        const stocks = res.stocks
        const netWorth = res.netWorth
        const totalInvested = res.totalInvested

        setNetWorthDates(netWorth.netWorthDates)
        setNetWorthValues(netWorth.netWorthValues)

        setTotalInvestedDates(totalInvested.totalInvestedDates)
        setTotalInvestedValues(totalInvested.totalInvestedValues)

        formatStocks(stocks)
        sortStocks('NEWEST', stocks)
        setStocks(stocks)

        setStocksInputLoading(false)
      })
      .catch((error) => {
        setError(error.message)

        setStocksInputLoading(false)
      })
  }

  function deletePurchase (ticker: string, purchaseId: number) {
    setStocksInputLoading(true)

    fetch('api/portfolio/delete_purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: demo ? 'demo' : user?.email,
        ticker,
        purchaseId
      })
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((res) => {
        const stocks = res.stocks
        const netWorth = res.netWorth
        const totalInvested = res.totalInvested

        setNetWorthDates(netWorth.netWorthDates)
        setNetWorthValues(netWorth.netWorthValues)

        setTotalInvestedDates(totalInvested.totalInvestedDates)
        setTotalInvestedValues(totalInvested.totalInvestedValues)

        formatStocks(stocks)
        sortStocks('NEWEST', stocks)
        setStocks(stocks)

        setStocksInputLoading(false)
      })
      .catch((error) => {
        setError(error.message)

        setStocksInputLoading(false)
      })
  }

  function handleDropdownClick (value: string) {
    const newStocks = [...stocks]
    sortStocks(value, newStocks)
    setStocks(newStocks)

    setOrderDropdownValue(value)
  }

  if (stocks.length === 0) return null

  return (
    <div
      className="flex flex-col w-full h-full p-2 sm:p-6"
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
