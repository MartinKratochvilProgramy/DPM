import { numberWithSpaces } from '@/utils/api/numberWithSpaces'
import React, { useEffect, useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { handleErrors } from '@/utils/client/handleErrors'
import PlotComponent from './PlotComponent'
import { useUser } from '@auth0/nextjs-auth0/client'
import { type NetWorthHistoryInterface } from '@/types/client/netWorth'
import { chartThemeDark, chartThemeLight } from '@/themes/chartThemes'
import { useTheme } from 'next-themes'

const NetWorthHistory = () => {
  const [currentNetWorth, setCurrentNetWorth] = useState(0)
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorthHistoryInterface[]>([])
  const [stocksHistoryLoaded, setStocksHistoryLoaded] = useState(false)
  const { theme } = useTheme()
  const [chartTheme, setChartTheme] = useState(theme === 'light' ? chartThemeLight : chartThemeDark)
  const { user } = useUser()

  useEffect(() => {
    setChartTheme(theme === 'light' ? chartThemeLight : chartThemeDark)
  }, [theme])

  useEffect(() => {
    fetch('api/stocks_history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((history) => {
        setNetWorthHistory(history)
        setStocksHistoryLoaded(true)

        setCurrentNetWorth(history[history.length - 1].netWorth)
      })
      .catch((error) => {
        console.log(error)
        setStocksHistoryLoaded(true)
      })
  }, [])

  function initHistoryChart () {
    const netWorthLayout = {
      xaxis: {
        title: {
          text: 'Time',
          font: {
            size: 18,
            color: chartTheme.color
          }
        },
        color: chartTheme.color,
        tickcolor: chartTheme.tickcolor,
        gridcolor: chartTheme.gridcolor
      },
      yaxis: {
        title: {
          text: `Net worth [${user.currency}]`,
          font: {
            size: 18,
            color: chartTheme.color
          }
        },
        color: chartTheme.color,
        tickcolor: chartTheme.tickcolor,
        gridcolor: chartTheme.gridcolor
      },
      margin: {
        l: 100,
        r: 20,
        b: 80,
        t: 20,
        pad: 5
      },
      autosize: true,
      plot_bgcolor: chartTheme.plot_bgcolor,
      paper_bgcolor: chartTheme.paper_bgcolor
    }
    const netWorthHistoryX: string[] = []
    const netWorthHistoryY: number[] = []

    netWorthHistory.forEach((stock) => {
      netWorthHistoryX.push(stock.date)
      netWorthHistoryY.push(stock.netWorth)
    })

    const netWorthData = [
      {
        x: netWorthHistoryX,
        y: netWorthHistoryY,
        mode: 'lines',
        line: {
          shape: 'line',
          color: 'rgb(37, 99, 235)'
        },
        name: 'Total net-worth history'
      }
    ]
    return { netWorthData, netWorthLayout }
  }

  const { netWorthData, netWorthLayout } = initHistoryChart()

  return (
    <div>
      <h1 className='text-3xl font-semibold mt-2 py-4 md:py-4 mb-0 text-black dark:text-white'>
        NET <span className='text-blue-600'>WORTH</span> HISTORY
      </h1>
      <div className='font-semibold text-black dark:text-white text-xs xsm:text-lg'>
        Total: <span className='text-blue-600'>{numberWithSpaces(currentNetWorth)}</span> {user.currency}
      </div>
      <div className='flex justify-center items-center min-h-[260px] md:min-h-[450px]'>
        {stocksHistoryLoaded
          ? <PlotComponent data={netWorthData} layout={netWorthLayout} />
          : <LoadingSpinner size={70} />
        }
      </div>
    </div>
  )
}

export default NetWorthHistory
