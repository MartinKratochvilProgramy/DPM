import React, { useState, useEffect } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import PieChart from './Stocks/PieChart'
import { Modal } from '@mui/material'
import { handleErrors } from '@/utils/client/handleErrors'
import { type StockInterface } from '@/types/api/stock'
import { useUser } from '@auth0/nextjs-auth0/client'
import './MainPage.css'
import '../LandingPage/Hero.css'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'

const MainPage = () => {
  const [stocks, setStocks] = useState<any>([])
  const [stocksLoaded, setStocksLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([])
  const [netWorthValues, setNetWorthValues] = useState<number[]>([])

  const [stocksOpen, setStocksOpen] = useState(false)

  const { user } = useUser()

  useEffect(() => {
    fetch('/api/stocks', {
      method: 'POST',
      body: JSON.stringify({ email: user?.email })
    })
      .then(handleErrors)
      .then((response: any) => response.json())
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
        setNetWorthDates={setNetWorthDates}
        setNetWorthValues={setNetWorthValues}
      />
      <div className='w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-4'>
        <div
          onClick={() => { setStocksOpen(true) }}
          className='card-shadow aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500 cursor-pointer'
        >
          <Stocks
            stocks={stocks}
            orderDropdownValue={orderDropdownValue}
            stocksLoaded={stocksLoaded}
            setOrderDropdownValue={setOrderDropdownValue}
            setStocks={setStocks}
            setError={setError}
          />
        </div>
        <div className='card-shadow aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500'>
          <NetWortHistory
            netWorthDates={netWorthDates}
            setNetWorthDates={setNetWorthDates}
            netWorthValues={netWorthValues}
            setNetWorthValues={setNetWorthValues}
            setError={setError}
          />
        </div>
        <div className='card-shadow aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500'>
          <PieChart stocks={stocks} />
        </div>
      </div>

      <Modal
        open={stocksOpen}
        onClose={() => { setStocksOpen(false) }}
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className='fixed max-w-[600px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl  aspect-[1.2] h-[80vh] border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <Stocks
              stocks={stocks}
              orderDropdownValue={orderDropdownValue}
              stocksLoaded={stocksLoaded}
              setOrderDropdownValue={setOrderDropdownValue}
              setStocks={setStocks}
              setError={setError}
            />
          </div>
        </div>
      </Modal>
    </Container>
  )
}

export default MainPage

// interface ParentComponentProps {
//   children: ReactNode
// }

// const GridComponent: React.FC<ParentComponentProps> = ({ children, setOpen }) => {
//   return (
//     <div className='card-shadow aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500'>
//       {children}
//     </div>
//   )
// }

// const ExpandedGridComponent: React.FC<ParentComponentProps> = ({ children }) => {
//   return (
//     <div className='bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl  aspect-[1.2] h-[80vh] border-solid border-[1px] border-blue-400 dark:border-gray-500'>
//       {children}
//     </div>
//   )
// }
