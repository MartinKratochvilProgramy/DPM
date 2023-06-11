import React, { useContext, useEffect, useRef } from 'react'
import {
  Chart, registerables
} from 'chart.js'
import 'chartjs-adapter-moment'
import { useTheme } from 'next-themes'
import '../../app/globals.css'
import { numberWithSpaces } from '@/utils/api/numberWithSpaces'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { CurrencyContext } from '@/pages/_app'

Chart.register(...registerables)

interface Props {
  netWorthDates: Date[]
  netWorthValues: number[]
  timeScale: TimeScaleInterface
}

const NetWortHistory: React.FC<Props> = ({
  netWorthDates,
  netWorthValues,
  timeScale
}) => {
  const { theme } = useTheme()
  const { currency } = useContext(CurrencyContext)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart>()

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'
  const extraLightThemeChartColor = 'rgb(192, 201, 217)'

  useEffect(() => {
    if (chartRef.current != null) {
      const ctx = chartRef.current.getContext('2d')!

      // Define your chart data and options
      const chartData = {
        labels: netWorthDates,
        datasets: [
          {
            label: 'Net Worth',
            data: netWorthValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            pointRadius: 0
          }
        ]
      }

      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: theme === 'dark' ? darkThemeChartColor : lightThemeChartColor
            }
          },
          title: {
            display: false,
            text: 'Net Worth'
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: timeScale
            },
            display: true,
            title: {
              display: true
            },
            grid: {
              color: theme === 'dark' ? darkThemeChartColor : extraLightThemeChartColor
            },
            ticks: {
              color: theme === 'dark' ? darkThemeChartColor : lightThemeChartColor
            }
          },
          y: {
            display: true,
            title: {
              display: false,
              text: 'Net Worth'
            },
            grid: {
              color: theme === 'dark' ? darkThemeChartColor : extraLightThemeChartColor,
              z: 10
            },
            ticks: {
              color: theme === 'dark' ? darkThemeChartColor : lightThemeChartColor
            }
          }
        }
      }

      // Create the chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
      })
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current != null) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [netWorthDates, netWorthValues])

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex py-1 md:py-2 lg:py-4 px-4 md:px-10 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 className='text-xl md:text-3xl playfair font-semibold mt-2 md:mt-4 lg:mt-0 mb-4 text-gray-700 dark:text-gray-300'>
          {numberWithSpaces(netWorthValues[netWorthValues.length - 1])} <span className='text-sm md:text-2xl'>{currency === undefined ? '' : currency}</span>
        </h2>
        <div className='flex justify-center items-center w-full px-0 md:px-6 h-full'>
          <canvas ref={chartRef} style={{ width: '0%', height: '0%' }}></canvas>
        </div>
      </div>
    </div>
  )
}

export default NetWortHistory
