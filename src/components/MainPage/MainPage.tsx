import React, { useEffect, useState, type ReactNode } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { handleErrors } from '@/utils/client/handleErrors'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import './MainPage.css'

const MainPage = () => {
  const [stocks, setStocks] = useState<any>([])
  const [stocksLoaded, setStocksLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')

  const { user } = useUser()

  useEffect(() => {
    fetch('/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ email: user?.email })
    })
      .then(handleErrors)
      .then(response => response.json())
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
        setError(e)
      }
      )
  }, [])

  return (
    <Container className='flex flex-col'>
      <StockInput
        setStocks={setStocks}
        setOrderDropdownValue={setOrderDropdownValue}
        error={error}
        setError={setError}
      />
      <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4'>
        <GridComponent>
          <Stocks
            stocks={stocks}
            stocksLoaded={stocksLoaded}
            orderDropdownValue={orderDropdownValue}
            setOrderDropdownValue={setOrderDropdownValue}
            setStocks={setStocks}
            setError={setError}
          />
        </GridComponent>
        <GridComponent>
          <NetWortHistory stocks={stocks} />
        </GridComponent>
      </div>
    </Container>
  )
}

export default MainPage

interface ParentComponentProps {
  children: ReactNode
}

const GridComponent: React.FC<ParentComponentProps> = ({ children }) => {
  return (
    <div className='card-shadow card-gradient dark:bg-opacity-50 hover:bg-opacity-60 dark:hover:bg-opacity-10 min-h-36 lg:h-[500px] rounded-2xl border border-blue-400 dark:border-gray-500'>
      {children}
    </div>
  )
}
