import React, { useEffect, useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { Modal } from '@mui/material'
import PlotComponent from './PlotComponent'
import { useTheme } from 'next-themes'
import { type PurchaseInterface } from '@/types/client/stock'
import getPricesInCurrency from '@/utils/client/getPricesInCurrency'
import '../../app/globals.css'

interface Props {
  stockTicker: string
  purchaseHistory: PurchaseInterface[]
  stockHistory: { ticker: string, dates: string[], values: number[] }
  loadingData: boolean
  dataLoaded: boolean
  stockChartLoadingError: string
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

    const purchasesX: string[] = []
    purchaseHistory.forEach((purchase) => {
      purchasesX.push(purchase.date)
    })
    const purchasesY = getPricesInCurrency(stockHistory.dates, stockHistory.values, purchasesX)

    const historyData = [
      {
        x: stockHistory.dates,
        y: stockHistory.values,
        mode: 'lines',
        line: {
          shape: 'line',
          color: '#2563eb'
        },
        name: 'Total net-worth history'
      },
      {
        x: purchasesX,
        y: purchasesY,
        type: 'scatter',
        mode: 'markers',
        marker: { color: 'red' },
        name: 'Total net-worth history'
      }
    ]
    return { historyData, historyLayout }
  }

  const { historyData, historyLayout } = initChart()

  return (
    <Modal
      open={open}
      onClose={() => { handleModalClose() }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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

export const chartThemeDark = {
  color: 'white',
  tickcolor: 'white',
  gridcolor: 'gray',
  fontColor: 'white',
  plot_bgcolor: 'rgb(31, 41, 55)',
  paper_bgcolor: 'rgb(31, 41, 55)'
}
export const chartThemeLight = {
  color: 'black',
  tickcolor: 'black',
  gridcolor: 'black',
  fontColor: 'black',
  plot_bgcolor: '#edeef1',
  paper_bgcolor: '#edeef1'
}
