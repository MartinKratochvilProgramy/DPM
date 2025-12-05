import React, { useContext, useEffect, useRef, useState } from 'react'
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded'
import { TimeScaleInterface } from '@/types/client/timeScale'
import { CurrencyContext } from '@/pages/_app'
import LineChart, { Series } from '../chart/LineChart'

function formatDateToYYYYMMDD(date: Date) {
  const parsed = new Date(date)
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(
    parsed.getDate()
  ).padStart(2, '0')}`
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
    if (!netWorthDates.length || !totalInvestedDates.length) return

    // 1. Create an array of {time, value} for invested
    const investedTimeline = totalInvestedDates.map((d, i) => ({
      time: formatDateToYYYYMMDD(d),
      value: totalInvestedValues[i]
    }))

    // 2. Iterate netWorthDates and always keep last known invested value
    let investedPointer = 0
    let lastKnownInvested = investedTimeline[0].value

    const netGainSeries: Series = {
      data: [],
      color: '#10b981',
      type: 'area'
    }

    for (let i = 0; i < netWorthDates.length; i++) {
      const time = formatDateToYYYYMMDD(netWorthDates[i])

      // Move investedPointer forward while dates are <= current netWorth date
      while (
        investedPointer < investedTimeline.length - 1 &&
        investedTimeline[investedPointer + 1].time <= time
      ) {
        investedPointer++
        lastKnownInvested = investedTimeline[investedPointer].value
      }

      // Net gain = netWorth(i) - invested(previous)
      const gain = netWorthValues[i] - lastKnownInvested

      netGainSeries.data.push({ time, value: gain })
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
