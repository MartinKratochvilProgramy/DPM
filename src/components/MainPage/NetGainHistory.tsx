import React, { useContext, useEffect, useRef, useState } from 'react';
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded';
import { type TimeScaleInterface } from '@/types/client/timeScale';
import { CurrencyContext } from '@/pages/_app';
import LineChart, { type Series } from '../chart/LineChart';
import { TimeSeries } from '@/types/client/timeSeries';

function formatDateToYYYYMMDD(date: Date) {
  const parsed = new Date(date);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(
    parsed.getDate(),
  ).padStart(2, '0')}`;
}

interface Props {
  netWorth: TimeSeries;
  totalInvested: TimeSeries;
  timeScale: TimeScaleInterface;
}

const NetGainHistory: React.FC<Props> = ({
  netWorth,
  totalInvested,
}) => {
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>();
  const { currency } = useContext(CurrencyContext);
  const containerRef = useRef<any>();

  useEffect(() => {
    if (netWorth.dates.length === 0 || totalInvested.dates.length === 0) return;

    // 1. Create an array of {time, value} for invested
    const investedTimeline = totalInvested.dates.map((d, i) => ({
      time: formatDateToYYYYMMDD(d),
      value: totalInvested.values[i],
    }));

    // 2. Iterate netWorth.dates and always keep last known invested value
    let investedPointer = 0;
    let lastKnownInvested = investedTimeline[0].value;

    const netGainSeries: Series = {
      data: [],
      color: '#10b981',
      type: 'area',
    };

    for (let i = 0; i < netWorth.dates.length; i++) {
      const time = formatDateToYYYYMMDD(netWorth.dates[i]);

      // Move investedPointer forward while dates are <= current netWorth date
      while (
        investedPointer < investedTimeline.length - 1 &&
        investedTimeline[investedPointer + 1].time <= time
      ) {
        investedPointer++;
        lastKnownInvested = investedTimeline[investedPointer].value;
      }

      // Net gain = netWorth(i) - invested(previous)
      const gain = netWorth.values[i] - lastKnownInvested;

      netGainSeries.data.push({ time, value: gain });
    }

    setLineChartSeries([netGainSeries]);
  }, [netWorth, totalInvested, totalInvested]);

  const latestGain = lineChartSeries?.[0]?.data.at(-1)?.value ?? 0;

  const maxGain =
    lineChartSeries?.[0]?.data.reduce((m, p) => Math.max(m, p.value), 0) ?? 0;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-4 lg:px-0 flex-col w-full h-full justify-center items-center">
        <h2 className="text-xl font-bold md:text-3xl raleway mt-1 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-0 text-gray-700 dark:text-gray-300">
          {numberWithSpacesRounded(latestGain)}{' '}
          <span className="text-[16px] md:text-[28px] playfair">
            {currency ?? ''}
          </span>
        </h2>

        <div className="text-gray-400 playfair">
          Max: {numberWithSpacesRounded(maxGain)}{' '}
          <span className="text-[8px] md:text-[12px] playfair">
            {currency ?? ''}
          </span>
        </div>

        <div
          ref={containerRef}
          className="flex justify-center items-center w-[90%] md:px-6 w-full h-full"
        >
          {lineChartSeries != null && (
            <LineChart
              series={lineChartSeries}
              width={containerRef.current?.offsetWidth}
              height={containerRef.current?.offsetHeight}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NetGainHistory;
