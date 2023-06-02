import React, { useState, useEffect } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import PieChart from './Stocks/PieChart'
import { Modal } from '@mui/material'
import { handleErrors } from '@/utils/client/handleErrors'
import { useUser } from '@auth0/nextjs-auth0/client'
import './MainPage.css'
import '../LandingPage/Hero.css'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { LoadingSpinner } from '../LoadingSpinner'

const MainPage = () => {
  const [stocks, setStocks] = useState<any>([])
  const [stocksLoaded, setStocksLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')
  const [stocksOpen, setStocksOpen] = useState(false)

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([])
  const [netWorthValues, setNetWorthValues] = useState<number[]>([])
  const [netWorthLoaded, setNetWorthLoaded] = useState(false)
  const [timeScale, setTimeScale] = useState<TimeScaleInterface>('second')
  const [netWorthHistoryOpen, setNetWorthHistoryOpen] = useState(false)

  const [pieOpen, setPieOpen] = useState(false)

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
      .catch(error => {
        setStocksLoaded(true)
        setError(error)
      }
      )
  }, [])

  useEffect(() => {
    fetch('api/net_worth_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user?.email
      })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((history) => {
        const values: number[] = history.values
        const dates: Date[] = history.dates

        setNetWorthValues(values)
        setNetWorthDates(dates)

        // difference between first and last writes
        const timeDiff = new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()
        const hour = 3.6e+6

        let newTimeScale: TimeScaleInterface
        if (timeDiff < 2 * hour) {
          newTimeScale = 'second'
        } else if (timeDiff < 24 * hour) {
          newTimeScale = 'hour'
        } else if (24 * hour <= timeDiff && timeDiff < 4 * 30 * 24 * hour) {
          newTimeScale = 'day'
        } else if (4 * 30 * 24 * hour <= timeDiff && timeDiff < 2 * 8760 * hour) {
          newTimeScale = 'month'
        } else {
          newTimeScale = 'year'
        }

        setTimeScale(newTimeScale)

        setNetWorthLoaded(true)
      })
      .catch((error) => {
        setNetWorthLoaded(true)
        setError(error)
      })
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
          className='card-shadow aspect-[1.2] flex items-center justify-center rounded-2xl border border-blue-400 dark:border-gray-500 cursor-pointer'
        >
          {stocksLoaded
            ? <Stocks
              stocks={stocks}
              orderDropdownValue={orderDropdownValue}
              setOrderDropdownValue={setOrderDropdownValue}
              setStocks={setStocks}
              setError={setError}
            />
            : <LoadingSpinner size={70} />
          }

        </div>
        <div
          onClick={() => { setNetWorthHistoryOpen(true) }}
          className='card-shadow aspect-[1.2] flex items-center justify-center rounded-2xl border border-blue-400 dark:border-gray-500 cursor-pointer'
        >
          {netWorthLoaded
            ? <NetWortHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              timeScale={timeScale}
            />
            : <LoadingSpinner size={70} />
          }
        </div>
        <div
          onClick={() => { setPieOpen(true) }}
          className='card-shadow aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500 cursor-pointer'
        >
          <PieChart stocks={stocks} stocksLoaded={stocksLoaded} />
        </div>
        <div
          onClick={() => { setPieOpen(true) }}
          className='card-shadow aspect-[1.2] rounded-2xl border border-blue-400 dark:border-gray-500 cursor-pointer'
        >
          <PieChart stocks={stocks} stocksLoaded={stocksLoaded} />
        </div>
      </div>

      <Modal
        open={stocksOpen}
        onClose={() => { setStocksOpen(false) }}
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className='fixed max-w-[600px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl aspect-auto md:aspect-[1.2] w-[90vw] md:w-auto h-[40vh] md:h-[80vh] border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <Stocks
              stocks={stocks}
              orderDropdownValue={orderDropdownValue}
              setOrderDropdownValue={setOrderDropdownValue}
              setStocks={setStocks}
              setError={setError}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={netWorthHistoryOpen}
        onClose={() => { setNetWorthHistoryOpen(false) }}
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl aspect-auto md:aspect-[1.2] w-[90vw] md:w-auto h-[40vh] md:h-[80vh] border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <NetWortHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              timeScale={timeScale}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={pieOpen}
        onClose={() => { setPieOpen(false) }}
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl aspect-auto md:aspect-[1.2] w-[90vw] md:w-auto h-[40vh] md:h-[80vh] p-0 md:px-14 border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <PieChart stocks={stocks} stocksLoaded={stocksLoaded} />
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
