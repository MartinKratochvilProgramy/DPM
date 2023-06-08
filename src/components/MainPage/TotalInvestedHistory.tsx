import React, { useEffect, useRef } from 'react'
import {
  Chart, registerables
} from 'chart.js'
import 'chartjs-adapter-moment'
import { Line } from 'react-chartjs-2'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useTheme } from 'next-themes'
import '../../app/globals.css'
import { numberWithSpaces } from '@/utils/api/numberWithSpaces'
import { type TimeScaleInterface } from '@/types/client/timeScale'

Chart.register(...registerables)

interface Props {
  totalInvestedDates: Date[]
  totalInvestedValues: number[]
  timeScale: TimeScaleInterface
}

const TotalInvestedHistory: React.FC<Props> = ({
  totalInvestedDates,
  totalInvestedValues,
  timeScale
}) => {
  const { theme } = useTheme()
  const { user } = useUser()

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart>()

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'
  const extraLightThemeChartColor = 'rgb(192, 201, 217)'

  useEffect(() => {
    if (chartRef.current != null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ctx = chartRef.current.getContext('2d')!

      // Define your chart data and options
      const chartData = {
        labels: totalInvestedDates,
        datasets: [
          {
            label: 'Total Invested',
            data: totalInvestedValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            radius: 0
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
            text: 'Total Invested'
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
              text: 'Total Invested'
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
  }, [])

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex py-1 md:py-2 lg:py-4 px-4 md:px-10 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 className='text-xl md:text-3xl playfair font-semibold mt-2 md:mt-10 lg:mt-0 mb-4 text-gray-700 dark:text-gray-300'>
          {numberWithSpaces(totalInvestedValues[totalInvestedValues.length - 1])} <span className='text-sm md:text-2xl'>{user?.currency}</span>
        </h2>
        <div className='flex justify-center items-center w-full px-0 md:px-6 h-full'>
          <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
        </div>
      </div>
    </div>
  )
}

export default TotalInvestedHistory
