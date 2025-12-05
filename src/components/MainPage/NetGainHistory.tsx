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
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
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

const NetGainHistory: React.FC<Props> = ({
  netWorthDates,
  netWorthValues,
  totalInvestedDates,
  totalInvestedValues
}) => {
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>()
  const { currency } = useContext(CurrencyContext)
  const containerRef = useRef<any>()

  useEffect(() => {
    if (
      netWorthDates.length === 0 ||
      netWorthValues.length === 0 ||
      totalInvestedDates.length === 0 ||
      totalInvestedValues.length === 0
    ) return

    // Build an index for totalInvested by date for fast lookups
    const investedIndex: Record<string, number> = {}
    for (let i = 0; i < totalInvestedDates.length; i++) {
      investedIndex[formatDateToYYYYMMDD(totalInvestedDates[i])] = totalInvestedValues[i]
    }

    const netGainSeries: Series = { data: [], color: '#10b981', type: 'area' }

    for (let i = 0; i < netWorthDates.length; i++) {
      const time = formatDateToYYYYMMDD(netWorthDates[i])

      // Get previous invested value:
      let investedPrev: number
      if (i === 0) {
        // For first date: subtract first totalInvested value
        investedPrev = totalInvestedValues[0]
      } else {
        const prevTime = formatDateToYYYYMMDD(netWorthDates[i - 1])
        investedPrev = investedIndex[prevTime] ?? totalInvestedValues[0]
      }

      const netGain = netWorthValues[i] - investedPrev

      netGainSeries.data.push({
        time,
        value: netGain
      })
    }

    // Update last value just to ensure correct last datapoint
    const lastNetWorth = netWorthValues.at(-1)
    if (lastNetWorth !== undefined && netGainSeries.data.length > 0) {
      const lastTime = formatDateToYYYYMMDD(netWorthDates.at(-1)!)
      const lastPrevInvested =
        investedIndex[formatDateToYYYYMMDD(netWorthDates.at(-2)!)] ??
        totalInvestedValues.at(-1)!

      const lastPoint = netWorthValues.at(-1)! - lastPrevInvested
      netGainSeries.data[netGainSeries.data.length - 1].value = lastPoint
    }

    setLineChartSeries([netGainSeries])
  }, [netWorthDates, netWorthValues, totalInvestedDates, totalInvestedValues])

  const latestGain =
    lineChartSeries?.[0]?.data.at(-1)?.value ?? 0

  const maxGain =
    lineChartSeries?.[0]?.data.reduce((m, p) => Math.max(m, p.value), 0) ?? 0

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-4 lg:px-0 flex-col w-full h-full justify-center items-center'>
        <h2 className='text-xl font-bold md:text-3xl raleway mt-1 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-0 text-gray-700 dark:text-gray-300'>
          {numberWithSpacesRounded(latestGain)} <span className='text-[16px] md:text-[28px] playfair'>{currency ?? ''}</span>
        </h2>

        <div className='text-gray-400 playfair'>
          Max: {numberWithSpacesRounded(maxGain)}{' '}
          <span className='text-[8px] md:text-[12px] playfair'>{currency ?? ''}</span>
        </div>

        <div
          ref={containerRef}
          className='flex justify-center items-center w-[90%] md:px-6 w-full h-full'
        >
          {lineChartSeries && (
            <LineChart
              series={lineChartSeries}
              width={containerRef.current?.offsetWidth}
              height={containerRef.current?.offsetHeight}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default NetGainHistory
