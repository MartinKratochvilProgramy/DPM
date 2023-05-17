/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react'
import { formatStocks } from '@/utils/formatStocks'
import { useUser } from '@auth0/nextjs-auth0/client'
import { sortStocks } from '@/utils/sortStocks'
import { LoadingSpinner } from './LoadingSpinner'
import { StockInput } from './StockInput'
import { StocksDisplay } from './StocksDisplay'

const Stocks = () => {
  const [stocks, setStocks] = useState<any>([])
  const [stocksLoaded, setStocksLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')

  const { user } = useUser()

  // useEffect(() => {
  //   console.log(stocks)
  // }, [stocks])

  useEffect(() => {
    fetch('/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ username: user?.email })
    })
      .then(async response => await response.json())
      .then(returnedStocks => {
        formatStocks(returnedStocks)

        setOrderDropdownValue('NEWEST')
        sortStocks('NEWEST', returnedStocks)

        setStocks(returnedStocks)
        setStocksLoaded(true)
      })
      .catch(e => {
        setStocks([])
        setStocksLoaded(true)
      }
      )

    fetch('api/stocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user?.email })
    })
      .then(async (response) => await response.json())
      .then((returnedStocks) => {
        formatStocks(returnedStocks)

        setOrderDropdownValue('NEWEST')
        sortStocks('NEWEST', returnedStocks)

        setStocks(returnedStocks)
        setStocksLoaded(true)
      })
      .catch((error) => {
        setStocks([])
        setStocksLoaded(true)
        setError(error)
      })
  }, [])

  return (
    <div className='flex flex-col w-full h-full'>
      <StockInput
        setStocks={setStocks}
        setError={setError}
        setOrderDropdownValue={setOrderDropdownValue}
        setStocksLoaded={setStocksLoaded}
      />
      {error.length > 0 && (<span className='font-semibold text-xl text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out'>{error}<br /></span>)}
      {stocksLoaded
        ? stocks.length > 0 && <StocksDisplay
          stocks={stocks}
          orderDropdownValue={orderDropdownValue}
          setOrderDropdownValue={setOrderDropdownValue}
          setStocks={setStocks}
          setError={setError}
          sortStocks={sortStocks}
        />
        : <div className='flex justify-center items-center min-h-[260px] md:min-h-[450px]'>
          <LoadingSpinner size={70} />
        </div>
      }
    </div>
  )
}

export default Stocks
