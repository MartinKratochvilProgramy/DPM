import React, { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Modal } from '@mui/material'
import PlotComponent from '../PlotComponent'
import { useTheme } from 'next-themes'
import { type PurchaseInterface } from '@/types/client/stock'
import { chartThemeDark, chartThemeLight } from '@/themes/chartThemes'
import '../../../app/globals.css'

interface Props {
  stockTicker: string
  purchaseHistory: PurchaseInterface[]
  stockHistory: { ticker: string, dates: Date[], values: number[] }
  loadingData: boolean
  dataLoaded: boolean
  stockChartLoadingError: string
}

function sameDay (d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

function findIndexInDateArray (dateToFind: Date, array: Date[]) {
  // dates are strings due to REST transfer bullshit
  for (let i = 0; i < array.length; i++) {
    const purchaseDate = new Date(dateToFind)
    const stockDate = new Date(array[i])
    if (sameDay(purchaseDate, stockDate)) {
      return i // Return the index if the dates match
    }
  }
  return -1 // Return -1 if the date is not found in the array
}

const StockChartModal: React.FC<Props> = ({ stockTicker, purchaseHistory, stockHistory, loadingData, dataLoaded, stockChartLoadingError }) => {
  const [open, setOpen] = useState(true)
  const { theme } = useTheme()
  const [chartTheme, setChartTheme] = useState(theme === 'light' ? chartThemeLight : chartThemeDark)

  useEffect(() => {
    setChartTheme(theme === 'light' ? chartThemeLight : chartThemeDark)
  }, [theme])

  function handleModalClose () {
    setOpen(false)
  }

  function initChart () {
    const historyLayout = {
      xaxis: {
        title: {
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
        l: 50,
        r: 50,
        b: 50,
        t: 0,
        pad: 5
      },
      autosize: true,
      showlegend: false,
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)'
    }

    const purchasesX: Date[] = []
    const purchasesY: number[] = []
    purchaseHistory.forEach((purchase) => {
      const i = findIndexInDateArray(purchase.date, stockHistory.dates)
      if (i !== -1) {
        purchasesX.push(purchase.date)
        purchasesY.push(stockHistory.values[i])
      }
    })
    // const purchasesY = getPricesInCurrency(stockHistory.dates, stockHistory.values, purchasesX)

    const historyData = [
      {
        x: stockHistory.dates,
        y: stockHistory.values,
        mode: 'lines',
        line: {
          shape: 'line',
          color: '#2563eb'
        },
        name: 'Stock Price'
      },
      {
        x: purchasesX,
        y: purchasesY,
        type: 'scatter',
        mode: 'markers',
        marker: { color: 'red' },
        name: 'Purchases'
      }
    ]
    return { historyData, historyLayout }
  }

  const { historyData, historyLayout } = initChart()

  return (
    <Modal
      open={open}
      onClose={() => { handleModalClose() }}
      aria-labelledby="stock-chart-modal"
      aria-describedby="show-detailed-stock-chart"
    >
      <div className='bg-gray-100 dark:bg-[#1e2836] opacity-[0.96] rounded-xl overflow-hidden w-10/12 md:w-8/12 border-solid border-[1px] border-blue-500 dark:border-gray-500 h-[80vh] fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className="flex flex-col w-full h-full justify-center items-center min-h-[260px]">
          {loadingData
            ? <LoadingSpinner size={86} />
            : <>
              {stockChartLoadingError.length > 0
                ? <div className='font-semibold text-xl text-red-600'>
                  {stockChartLoadingError}
                </div>
                : <div
                  className="flex flex-col justify-center items-center w-full h-full"
                  onClick={(e) => { e.stopPropagation() }}
                >
                  <h2 className='playfair mt-4 mb-4 text-2xl lg:text-3xl text-gray-800 dark:text-gray-100'>{stockTicker}</h2>
                  <PlotComponent data={historyData} layout={historyLayout} />
                </div>
              }
            </>
          }
        </div>
      </div>
    </Modal>
  )
}

export default StockChartModal
