import React, { useContext, useEffect, useRef, useState } from 'react'
import 'chartjs-adapter-moment'
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded'
import { type TimeScaleInterface } from '@/types/client/timeScale'
import { CurrencyContext } from '@/pages/_app'
import '../../app/globals.css'
import LineChart, { type Series } from '../chart/LineChart'
import { type LineData } from 'lightweight-charts'
import { orange } from './RelativeChangeHistory'

function formatDateToYYYYMMDD(date: Date) {
  const parsedDate = new Date(date)

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface Props {
  netWorthDates: Date[]
  netWorthValues: number[]
  totalInvestedDates: Date[]
  totalInvestedValues: number[]
  timeScale: TimeScaleInterface
}

const NetWortHistory: React.FC<Props> = ({
  netWorthDates,
  netWorthValues,
  totalInvestedDates,
  totalInvestedValues
}) => {
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>()

  const { currency } = useContext(CurrencyContext)

  const containerRef = useRef<any>()

  useEffect(() => {
    const totalInvestedData = totalInvestedDates.flatMap((date, i) => {
      const values = []
      if (i > 0) {
        values.push({
          time: formatDateToYYYYMMDD(totalInvestedDates[i]),
          value: totalInvestedValues[i - 1]
        })
      } else {
        values.push({
          time: formatDateToYYYYMMDD(totalInvestedDates[i]),
          value: totalInvestedValues[i]
        })
      }
      return values
    })

    const lastDate = netWorthDates.at(-1)
    const lastInvested = totalInvestedValues.at(-1)
    if (lastDate !== undefined && lastInvested !== undefined) {
      totalInvestedData.push({
        time: formatDateToYYYYMMDD(lastDate),
        value: lastInvested
      })
    }

    const netWorthSeries: Series = { data: [], color: '#3b82f6', type: 'area' }
    for (let i = 0; i < netWorthDates.length; i++) {
      const time = formatDateToYYYYMMDD(netWorthDates[i])

      // Push only if the date (time) does not already exist in the data array
      if (!netWorthSeries.data.some((e: LineData) => e.time === time)) {
        netWorthSeries.data.push({
          time,
          value: netWorthValues[i]
        })
      }
    }

    // update last value
    const lastNetWorthValue = netWorthValues.at(-1)
    const lastDataPoint = netWorthSeries.data.at(-1)
    if (lastNetWorthValue !== undefined && lastDataPoint?.value !== undefined) {
      lastDataPoint.value = lastNetWorthValue
    }

    setLineChartSeries([
      netWorthSeries,
      {
        data: totalInvestedData,
        color: orange,
        type: 'line'
      }
    ])
  }, [netWorthDates, netWorthValues, totalInvestedDates, totalInvestedValues])

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-4 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 className='text-xl font-bold md:text-3xl raleway mt-1 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-0 text-gray-700 dark:text-gray-300'>
          {numberWithSpacesRounded(netWorthValues[netWorthValues.length - 1])} <span className='text-[16px] md:text-[28px] playfair'>{currency === undefined ? '' : currency}</span>
        </h2>
        <div className='text-gray-400 playfair'>Max: {numberWithSpacesRounded(Math.max(...netWorthValues))} <span className='text-[8px] md:text-[12px] playfair'>{currency === undefined ? '' : currency}</span></div>
        <div ref={containerRef} className='flex justify-center items-center w-[90%] md:px-6 w-full h-full'>
          {(lineChartSeries != null) && <LineChart series={lineChartSeries} width={containerRef.current.offsetWidth} height={containerRef.current.offsetHeight} />}
        </div>
      </div>
    </div>
  )
}

export default NetWortHistory
