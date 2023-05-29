import React, { useState, type ReactNode } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import './MainPage.css'

const MainPage = () => {
  const [stocks, setStocks] = useState<any>([])
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([])
  const [netWorthValues, setNetWorthValues] = useState<number[]>([])

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
    <div className='card-shadow card-gradient dark:bg-opacity-50 hover:bg-opacity-60 dark:hover:bg-opacity-10 min-h-36 lg:h-[500px] rounded-2xl border border-blue-400 dark:border-gray-500'>
      {children}
    </div>
  )
}
