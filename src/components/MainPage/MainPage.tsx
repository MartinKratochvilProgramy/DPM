import React, { useState, type ReactNode } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import './MainPage.css'
import { useUser } from '@auth0/nextjs-auth0/client'

const MainPage = () => {
  const [stocks, setStocks] = useState<any>([])
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([])
  const [netWorthValues, setNetWorthValues] = useState<number[]>([])

  const { user } = useUser()

  function SCRATCHUpdateStocks () {
    fetch('api/update_stocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email
      })
    }).catch(e => { console.log(e) })
  }

  return (
    <Container className='flex flex-col'>
      <StockInput
        setStocks={setStocks}
        setOrderDropdownValue={setOrderDropdownValue}
        error={error}
        setError={setError}
        setNetWorthDates={setNetWorthDates}
        setNetWorthValues={setNetWorthValues}
      />
      <button
        onClick={SCRATCHUpdateStocks}
        className="relative flex flex-row mt-2 px-7 py-3 text-white bg-blue-600 font-medium text-sm leading-snug uppercase rounded whitespace-nowrap shadow-md hover:bg-blue-700 hover:text-white hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
              update
      </button>
      <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4'>
        <GridComponent>
          <Stocks
            stocks={stocks}
            orderDropdownValue={orderDropdownValue}
            setOrderDropdownValue={setOrderDropdownValue}
            setStocks={setStocks}
            setError={setError}
          />
        </GridComponent>
        <GridComponent>
          <NetWortHistory
            netWorthDates={netWorthDates}
            setNetWorthDates={setNetWorthDates}
            netWorthValues={netWorthValues}
            setNetWorthValues={setNetWorthValues}
            setError={setError}
          />
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
    <div className='card-shadow card-gradient dark:bg-opacity-50 hover:bg-opacity-60 dark:hover:bg-opacity-10 aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500'>
      {children}
    </div>
  )
}
