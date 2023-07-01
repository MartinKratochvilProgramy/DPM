import React, { useEffect, useRef, useState } from 'react'
import {
  Chart, registerables
} from 'chart.js'
import 'chartjs-adapter-moment'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { type ChartLoadDuration } from '@/types/client/chartLoadDuration'
import '../../app/globals.css'

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
  const [loadDuration, setLoadDuration] = useState<ChartLoadDuration>(1000)

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart>()

  const chartColor = '#949aa6'

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

      if (ctx === null) return

      // Create the chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          animation: { duration: loadDuration },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: chartColor
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
                color: chartColor
              },
              ticks: {
                color: chartColor
              }
            },
            y: {
              display: true,
              title: {
                display: false,
                text: 'Net Worth'
              },
              grid: {
                color: chartColor,
                z: 10
              },
              ticks: {
                color: chartColor
              }
            }
          }
        }
      })
    }

    if (loadDuration === 1000) {
      setLoadDuration(0)
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current != null) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [relativeChangeDates, relativeChangeValues])

  let lastValue: number
  if (relativeChangeValues.at(-1) === undefined) {
    lastValue = 0
  } else {
    lastValue = Math.round(relativeChangeValues[relativeChangeValues.length - 1] * 100) / 100
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex py-0 md:py-0 lg:py-4 px-2 md:px-5 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 style={{ color: lastValue >= 0 ? green : red }} className='text-xl space-x-1 flex text-center md:text-3xl playfair mt-0 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-2'>
          <div className='w-full h-full flex justify-center items-center'>{lastValue >= 0 ? '+' : ''}</div>
          <div className='w-full h-full flex justify-center items-center pb-0 sm:pb-2'>{lastValue}</div>
          <span className='w-full h-full flex justify-center pt-1 items-centertext-sm md:text-2xl'>%</span>
        </h2>
        <div className='flex justify-center items-center w-full px-0 md:px-6 h-full'>
          <canvas ref={chartRef} style={{ width: '0%', height: '0%' }}></canvas>
        </div>
      </div>
    </div>
  )
}

export default RelativeChangeHistory
