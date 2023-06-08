import React, { useEffect, useRef } from 'react'
import {
  Chart, registerables
} from 'chart.js'
import 'chartjs-adapter-moment'
import { useTheme } from 'next-themes'
import '../../app/globals.css'
import { type TimeScaleInterface } from '@/types/client/timeScale'

Chart.register(...registerables)

interface Props {
  relativeChangeDates: Date[]
  relativeChangeValues: number[]
  timeScale: TimeScaleInterface
}

const RelativeChangeHistory: React.FC<Props> = ({
  relativeChangeDates,
  relativeChangeValues,
  timeScale
}) => {
  const { theme } = useTheme()

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart>()

  const darkThemeChartColor = '#9ca3af'
  const lightThemeChartColor = '#374151'
  const extraLightThemeChartColor = 'rgb(192, 201, 217)'

  const green = 'rgba(19, 168, 41, 1)'
  const greenLowOpacity = 'rgba(19, 168, 41, 0.1)'
  const red = 'rgba(220, 38, 38, 1)'
  const redLowOpacity = 'rgba(220, 38, 38, 0.11)'

  useEffect(() => {
    if (chartRef.current != null) {
      const ctx = chartRef.current.getContext('2d')

      // Define your chart data and options
      const chartData = {
        labels: relativeChangeDates,
        datasets: [
          {
            label: 'Relative Change',
            data: relativeChangeValues,
            borderColor: lastValue >= 0 ? green : red,
            backgroundColor: lastValue >= 0 ? greenLowOpacity : redLowOpacity,
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
            text: 'Change'
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
  }, [])

  let lastValue: number
  if (relativeChangeValues.at(-1) === undefined) {
    lastValue = 0
  } else {
    lastValue = Math.round(relativeChangeValues[relativeChangeValues.length - 1] * 100) / 100
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex py-1 md:py-2 lg:py-4 px-4 md:px-10 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 style={{ color: lastValue >= 0 ? green : red }} className='text-xl space-x-1 flex text-center md:text-3xl playfair font-semibold mt-2 md:mt-10 lg:mt-0 mb-4'>
          <div className='w-full h-full flex justify-center items-center'>{lastValue >= 0 ? '+' : ''}</div>
          <div className='w-full h-full flex justify-center items-center pb-2'>{lastValue}</div>
          <span className='w-full h-full flex justify-center pt-1 items-centertext-sm md:text-2xl'>%</span>
        </h2>
        <div className='flex justify-center items-center w-full px-0 md:px-6 h-full'>
          <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
        </div>
      </div>
    </div>
  )
}

export default RelativeChangeHistory
