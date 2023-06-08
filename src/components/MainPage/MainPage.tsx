import React, { useState, useEffect, type ReactNode } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import PieChart from './Stocks/PieChart'
import { Modal } from '@mui/material'
import { handleErrors } from '@/utils/client/handleErrors'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { LoadingSpinner } from '../LoadingSpinner'
import RelativeChangeHistory from './RelativeChangeHistory'
import TotalInvestedHistory from './TotalInvestedHistory'
import './MainPage.css'
import '../LandingPage/Hero.css'

const MainPage = () => {
  const [stocks, setStocks] = useState<any>([])
  const [stocksLoaded, setStocksLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')
  const [stocksOpen, setStocksOpen] = useState(false)

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([])
  const [netWorthValues, setNetWorthValues] = useState<number[]>([])
  const [netWorthLoaded, setNetWorthLoaded] = useState(false)
  const [timeScale, setTimeScale] = useState<TimeScaleInterface>('month')
  const [netWorthHistoryOpen, setNetWorthHistoryOpen] = useState(false)

  const [relativeChangeDates, setRelativeChangeDates] = useState<Date[]>([])
  const [relativeChangeValues, setRelativeChangeValues] = useState<number[]>([])
  const [relativeChangeLoaded, setRelativeChangeLoaded] = useState(false)
  const [relativeChangeOpen, setRelativeChangeOpen] = useState(false)

  const [pieOpen, setPieOpen] = useState(false)

  const [totalInvestedDates, setTotalInvestedDates] = useState<Date[]>([])
  const [totalInvestedValues, setTotalInvestedValues] = useState<number[]>([])
  const [totalInvestedLoaded, setTotalInvestedLoaded] = useState(false)
  const [totalInvestedOpen, setTotalInvestedOpen] = useState(false)

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
    fetch('api/net_worth', {
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

  useEffect(() => {
    fetch('api/relative_change', {
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
      .then((relativeChange) => {
        let values: number[] = relativeChange.values
        values = values.map(value => { return (value * 100 - 100) })
        const dates: Date[] = relativeChange.dates

        // do not need to set timeScale here as it is being set in api/net_wort call

        setRelativeChangeValues(values)
        setRelativeChangeDates(dates)

        setRelativeChangeLoaded(true)
      })
      .catch((error) => {
        setRelativeChangeLoaded(true)
        setError(error)
      })
  }, [])

  useEffect(() => {
    fetch('api/total_invested', {
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
      .then((totalInvested) => {
        const values: number[] = totalInvested.values
        const dates: Date[] = totalInvested.dates

        // do not need to set timeScale here as it is being set in api/net_wort call

        setTotalInvestedDates(dates)
        setTotalInvestedValues(values)

        setTotalInvestedLoaded(true)
      })
      .catch((error) => {
        setTotalInvestedLoaded(true)
        setError(error)
      })
  }, [])

  // function updateStocks () {
  //   fetch('api/update_stocks', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       email: user?.email
  //     })
  //   })
  //     .then(handleErrors)
  //     .then(response => response.json())
  //     .then((res) => {
  //       console.log(res)
  //     })
  //     .catch((error) => {
  //       setRelativeChangeLoaded(true)
  //       setError(error)
  //     })
  // }

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
      {/* <button onClick={updateStocks}>Update</button> */}
      <div className='w-full flex flex-wrap justify-center gap-5 mt-4'>
        <Card setOpen={() => { setStocksOpen(true) }}>
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
        </Card>
        <Card setOpen={() => { setNetWorthHistoryOpen(true) }}>
          {netWorthLoaded
            ? <NetWortHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              timeScale={timeScale}
            />
            : <LoadingSpinner size={70} />
          }
        </Card>
        <Card setOpen={() => { setPieOpen(true) }}>
          {stocksLoaded
            ? <PieChart stocks={stocks} stocksLoaded={stocksLoaded} />
            : <LoadingSpinner size={70} />
          }
        </Card>
        <Card setOpen={() => { setRelativeChangeOpen(true) }}>
          {relativeChangeLoaded
            ? <RelativeChangeHistory
              relativeChangeDates={relativeChangeDates}
              relativeChangeValues={relativeChangeValues}
              timeScale={timeScale}
            />
            : <LoadingSpinner size={70} />
          }
        </Card>
        <Card setOpen={() => { setTotalInvestedOpen(true) }}>
          {totalInvestedLoaded
            ? <TotalInvestedHistory
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={timeScale}
            />
            : <LoadingSpinner size={70} />
          }
        </Card>
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
          <div className='fixed left-[5vw] right-[5vw] top-[5vh] bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl border-solid border-[1px] border-blue-400 dark:border-gray-500'>
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

      <Modal
        open={relativeChangeOpen}
        onClose={() => { setRelativeChangeOpen(false) }}
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className='fixed left-[5vw] right-[5vw] top-[5vh] bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <RelativeChangeHistory
              relativeChangeDates={relativeChangeDates}
              relativeChangeValues={relativeChangeValues}
              timeScale={timeScale}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={totalInvestedOpen}
        onClose={() => { setTotalInvestedOpen(false) }}
        aria-labelledby="stock-chart-modal"
        aria-describedby="show-detailed-stock-chart"
      >
        <div>
          <div className='fixed left-[5vw] right-[5vw] top-[5vh] bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <TotalInvestedHistory
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={timeScale}
            />
          </div>
        </div>
      </Modal>
    </Container>
  )
}

export default MainPage

interface CardInterface {
  children: ReactNode
  setOpen: () => void
}

const Card: React.FC<CardInterface> = ({ children, setOpen }) => {
  return (
    <div
      onClick={setOpen}
      className='card-shadow hover:bg-opacity-10 dark:hover:bg-opacity-5 hover:bg-red-100 w-[290px] md:w-[460px] aspect-[1.2] flex items-center justify-center rounded-2xl border border-blue-400 dark:border-gray-500 cursor-pointer'
    >
      {children}
    </div>
  )
}

// const ExpandedCard: React.FC<ParentComponentProps> = ({ children }) => {
//   return (
//     <div className='bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl  aspect-[1.2] h-[80vh] border-solid border-[1px] border-blue-400 dark:border-gray-500'>
//       {children}
//     </div>
//   )
// }
