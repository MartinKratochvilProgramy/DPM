import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Chart, registerables
} from 'chart.js'
import 'chartjs-adapter-moment'
import '../../app/globals.css'
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { CurrencyContext } from '@/pages/_app'
import { type ChartLoadDuration } from '@/types/client/chartLoadDuration'
import { chartColor } from './RelativeChangeHistory'

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
  const [loadDuration, setLoadDuration] = useState<ChartLoadDuration>(1000)

  const { currency } = useContext(CurrencyContext)

  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: any

    if (chartRef.current != null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ctx = chartRef.current.getContext('2d')!

      const totalInvestedData = totalInvestedDates.flatMap((date, i) => {
        const values = []
        if (i > 0) {
          values.push({
            x: totalInvestedDates[i],
            y: totalInvestedValues[i - 1]
          })
        }
        values.push({
          x: totalInvestedDates[i],
          y: totalInvestedValues[i]
        })

        return values
      })

      const s1 = {
        label: 'Net Worth',
        data: totalInvestedData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        borderWidth: 1,
        pointRadius: 0.5
      }

      // Create the chart instance
      chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [s1] },
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
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (chart) {
        chart.destroy()
      }
    }
  }, [totalInvestedDates, totalInvestedValues])

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex pt-0 md:pt-0 lg:pt-4 px-2 md:px-5 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 className='text-xl md:text-3xl font-bold raleway mt-0 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-4 text-gray-700 dark:text-gray-300'>
          {numberWithSpacesRounded(totalInvestedValues[totalInvestedValues.length - 1])} <span className='playfair text-[16px] md:text-[28px]'>{currency === undefined ? '' : currency}</span>
        </h2>
        <div className='flex justify-center items-center w-full px-0 md:px-6 h-full'>
          <canvas ref={chartRef} style={{ width: '0%', height: '0%' }}></canvas>
        </div>
      </div>
    </div>
  )
}

export default TotalInvestedHistory
