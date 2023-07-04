import React, { useState, useEffect, type ReactNode, useContext } from 'react'
import Container from '../Container'
import NetWortHistory from './NetWortHistory'
import { StockInput } from './Stocks/StockInput'
import { Stocks } from './Stocks'
import PieChart from './Stocks/PieChart'
import { handleErrors } from '@/utils/client/handleErrors'
import { useUser } from '@auth0/nextjs-auth0/client'
import { formatStocks } from '@/utils/client/formatStocks'
import { sortStocks } from '@/utils/client/sortStocks'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { LoadingSpinner } from '../LoadingSpinner'
import RelativeChangeHistory from './RelativeChangeHistory'
import TotalInvestedHistory from './TotalInvestedHistory'
import { Modal } from '@mui/material'
import { CurrencySelect } from '@/components/MainPage/Stocks/CurrencySelect'
import { CurrencyContext } from '@/pages/_app'
import './MainPage.css'
import '../LandingPage/Hero.css'
import { calculateTimeScale } from '@/utils/client/calculateTimeScale'
import { updatePrices } from '@/utils/client/updatePrices'
import { type StockInterface } from '@/types/client/stock'

interface Props {
  demo: boolean
}

const MainPage: React.FC<Props> = ({ demo }) => {
  const [stocksInputLoading, setStocksInputLoading] = useState(false)

  const [stocks, setStocks] = useState<any[]>([])
  const [stocksLoaded, setStocksLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [orderDropdownValue, setOrderDropdownValue] = useState('NEWEST')
  const [stocksOpen, setStocksOpen] = useState(false)

  const [netWorthDates, setNetWorthDates] = useState<Date[]>([])
  const [netWorthValues, setNetWorthValues] = useState<number[]>([])
  const [netWorthLoaded, setNetWorthLoaded] = useState(false)
  const [netWorthTimeScale, setNetWorthTimeScale] = useState<TimeScaleInterface>('month')
  const [netWorthHistoryOpen, setNetWorthHistoryOpen] = useState(false)

  const [relativeChangeDates, setRelativeChangeDates] = useState<Date[]>([])
  const [relativeChangeValues, setRelativeChangeValues] = useState<number[]>([])
  const [relativeChangeLoaded, setRelativeChangeLoaded] = useState(false)
  const [relativeChangeTimeScale, setRelativeChangeTimeScale] = useState<TimeScaleInterface>('month')
  const [relativeChangeOpen, setRelativeChangeOpen] = useState(false)

  const [pieOpen, setPieOpen] = useState(false)

  const [totalInvestedDates, setTotalInvestedDates] = useState<Date[]>([])
  const [totalInvestedValues, setTotalInvestedValues] = useState<number[]>([])
  const [totalInvestedLoaded, setTotalInvestedLoaded] = useState(false)
  const [totalInvestedTimeScale, setTotalInvestedTimeScale] = useState<TimeScaleInterface>('month')
  const [totalInvestedOpen, setTotalInvestedOpen] = useState(false)

  const { user } = useUser()
  const { currency } = useContext(CurrencyContext)

  useEffect(() => {
    // set interval to refetch stocks
    if (stocks.length === 0 || process.env.NODE_ENV === 'development') return

    const INTERVALms = 5000

    const intervalId = setInterval(() => {
      getCurrentStockPrices()
    }, INTERVALms)

    return () => {
      clearInterval(intervalId)
    }
  }, [stocks])

  useEffect(() => {
    fetch('/api/portfolio/stocks', {
      method: 'POST',
      body: JSON.stringify({ email: demo ? 'demo' : user?.email })
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
    fetch('api/portfolio/net_worth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: demo ? 'demo' : user?.email
      })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((history) => {
        const values: number[] = history.values
        const dates: Date[] = history.dates

        setNetWorthValues(values)
        setNetWorthDates(dates)

        const timeScale = calculateTimeScale(dates)
        setNetWorthTimeScale(timeScale)

        setNetWorthLoaded(true)
      })
      .catch((error) => {
        setNetWorthLoaded(true)
        setError(error)
      })
  }, [])

  useEffect(() => {
    fetch('api/portfolio/relative_change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: demo ? 'demo' : user?.email
      })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((relativeChange) => {
        let values: number[] = relativeChange.values
        values = values.map(value => { return (value * 100 - 100) })
        const dates: Date[] = relativeChange.dates

        const timeScale = calculateTimeScale(dates)
        setRelativeChangeTimeScale(timeScale)

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
    fetch('api/portfolio/total_invested', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: demo ? 'demo' : user?.email
      })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((totalInvested) => {
        const values: number[] = totalInvested.values
        const dates: Date[] = totalInvested.dates

        const timeScale = calculateTimeScale(dates)
        setTotalInvestedTimeScale(timeScale)

        setTotalInvestedDates(dates)
        setTotalInvestedValues(values)

        setTotalInvestedLoaded(true)
      })
      .catch((error) => {
        setTotalInvestedLoaded(true)
        setError(error)
      })
  }, [])

  function getCurrentStockPrices () {
    if (currency === '') return
    fetch('api/get_current_stock_prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tickers: stocks.map(({ ticker }) => ticker),
        currency
      })
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((res) => {
        let newStocks: StockInterface[] = [...stocks]

        newStocks = updatePrices(newStocks, res)

        setStocks(newStocks)

        let newNetWorth = 0
        newStocks.forEach(stock => {
          newNetWorth += stock.amount * stock.prevClose
        })
        newNetWorth = parseFloat(newNetWorth.toFixed(2))

        if (netWorthDates.length > 0 && netWorthValues.length > 0) {
          setNetWorthDates([...netWorthDates, new Date()])
          setNetWorthValues([...netWorthValues, newNetWorth])
        }

        if (relativeChangeDates.length > 0 && relativeChangeValues.length > 0 && netWorthValues.length > 0) {
          setRelativeChangeDates([...relativeChangeDates, new Date()])
          const newRelativeChange = relativeChangeValues[relativeChangeValues.length - 1] * newNetWorth / netWorthValues[netWorthValues.length - 1]
          setRelativeChangeValues([...relativeChangeValues, newRelativeChange])
        }
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  return (
    <Container className='flex flex-col'>
      <StockInput
        demo={demo}
        setStocks={setStocks}
        setOrderDropdownValue={setOrderDropdownValue}
        error={error}
        setError={setError}
        stocksInputLoading={stocksInputLoading}
        setStocksInputLoading={setStocksInputLoading}
        setNetWorthDates={setNetWorthDates}
        setNetWorthValues={setNetWorthValues}
        setTotalInvestedDates={setTotalInvestedDates}
        setTotalInvestedValues={setTotalInvestedValues}
      />
      <div className='w-full flex flex-wrap justify-center gap-5 mt-4'>
        <Card setOpen={() => { setStocksOpen(true) }}>
          {stocksLoaded
            ? <Stocks
              demo={demo}
              stocks={stocks}
              orderDropdownValue={orderDropdownValue}
              setOrderDropdownValue={setOrderDropdownValue}
              setStocks={setStocks}
              setError={setError}
              setStocksInputLoading={setStocksInputLoading}
              setNetWorthDates={setNetWorthDates}
              setNetWorthValues={setNetWorthValues}
              setTotalInvestedDates={setTotalInvestedDates}
              setTotalInvestedValues={setTotalInvestedValues}
            />
            : <LoadingSpinner size={70} />
          }
        </Card>
        <Card setOpen={() => { setNetWorthHistoryOpen(true) }}>
          {netWorthLoaded
            ? <NetWortHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              timeScale={netWorthTimeScale}
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
              timeScale={relativeChangeTimeScale}
            />
            : <LoadingSpinner size={70} />
          }
        </Card>
        <Card setOpen={() => { setTotalInvestedOpen(true) }}>
          {totalInvestedLoaded
            ? <TotalInvestedHistory
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={totalInvestedTimeScale}
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
          <div className='fixed max-w-[600px] left-1/2 top-[5vh] bottom-[5vh] transform -translate-x-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md w-[90vw] border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <Stocks
              demo={demo}
              stocks={stocks}
              orderDropdownValue={orderDropdownValue}
              setOrderDropdownValue={setOrderDropdownValue}
              setStocks={setStocks}
              setError={setError}
              setStocksInputLoading={setStocksInputLoading}
              setNetWorthDates={setNetWorthDates}
              setNetWorthValues={setNetWorthValues}
              setTotalInvestedDates={setTotalInvestedDates}
              setTotalInvestedValues={setTotalInvestedValues}
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
          <div className='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <NetWortHistory
              netWorthDates={netWorthDates}
              netWorthValues={netWorthValues}
              timeScale={netWorthTimeScale}
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
          <div className='fixed flex justify-center items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md aspect-auto md:aspect-[1.2] w-[90vw] md:w-auto h-[40vh] md:h-[90vh] p-0 md:px-14 border-solid border-[1px] border-blue-400 dark:border-gray-500'>
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
          <div className='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <RelativeChangeHistory
              relativeChangeDates={relativeChangeDates}
              relativeChangeValues={relativeChangeValues}
              timeScale={relativeChangeTimeScale}
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
          <div className='fixed flex justify-center items-center h-[400px] sm:h-auto transform -translate-y-1/2 sm:-translate-y-0 left-[5vw] right-[5vw] top-1/2 sm:top-[5vh] aspect-auto sm:bottom-[5vh] overflow-y-auto bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-md border-solid border-[1px] border-blue-400 dark:border-gray-500'>
            <TotalInvestedHistory
              totalInvestedDates={totalInvestedDates}
              totalInvestedValues={totalInvestedValues}
              timeScale={totalInvestedTimeScale}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={currency === undefined}
        onClose={() => { }}
        aria-labelledby="set-currency-modal"
        aria-describedby="show-currency-select-modal"
      >
        <div>
          <CurrencySelect />
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
      className='card-shadow hover:bg-opacity-10 dark:hover:bg-opacity-[0.02] hover:bg-red-100 w-[290px] md:w-[460px] aspect-[1.2] flex items-center justify-center rounded-md sm:rounded-lg border border-blue-400 dark:border-gray-500 cursor-pointer'
    >
      {children}
    </div>
  )
}
