import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded';
import { CurrencyContext } from '@/pages/_app';
import LineChart, { type Series } from '../chart/LineChart';
import { TimeSeries } from '@/types/client/timeSeries';
import { DateRange } from '@/types/client/dateRange';
import {
  filterTimeSeriesByRange,
  normalizeTimeSeries,
} from '@/utils/client/filterTimeSeriesByTimeRange';
import { formatDateToYYYYMMDD } from '@/types/client/formatDate';

interface Props {
  netWorth: TimeSeries;
  totalInvested: TimeSeries;
  dateRange: DateRange;
}

const NetGainHistory: React.FC<Props> = ({
  netWorth,
  totalInvested,
  dateRange,
}) => {
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>();
  const { currency } = useContext(CurrencyContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredNetWorth = useMemo(() => {
    const filtered = filterTimeSeriesByRange(netWorth, dateRange);
    return dateRange === 'ALL' ? filtered : normalizeTimeSeries(filtered);
  }, [netWorth, dateRange]);

  const filteredTotalInvested = useMemo(() => {
    const filtered = filterTimeSeriesByRange(totalInvested, dateRange);
    return dateRange === 'ALL' ? filtered : normalizeTimeSeries(filtered);
  }, [totalInvested, dateRange]);

  useEffect(() => {
    if (
      filteredNetWorth.dates.length === 0 ||
      filteredNetWorth.values.length === 0
    ) {
      setLineChartSeries(undefined);
      return;
    }

    // if totalInvested is empty → assume invested = 0
    const investedTimeline =
      filteredTotalInvested.dates.length > 0
        ? filteredTotalInvested.dates.map((d, i) => ({
          time: formatDateToYYYYMMDD(d),
          value: filteredTotalInvested.values[i],
        }))
        : [
          {
            time: formatDateToYYYYMMDD(filteredNetWorth.dates[0]),
            value: 0,
          },
        ];

    let investedPointer = 0;
    let lastKnownInvested = investedTimeline[0].value;

    const netGainSeries: Series = {
      data: [],
      color: '#10b981',
      type: 'area',
    };

    for (let i = 0; i < filteredNetWorth.dates.length; i++) {
      const time = formatDateToYYYYMMDD(filteredNetWorth.dates[i]);

      while (
        investedPointer < investedTimeline.length - 1 &&
        investedTimeline[investedPointer + 1].time <= time
      ) {
        investedPointer++;
        lastKnownInvested = investedTimeline[investedPointer].value;
      }

      const gain = filteredNetWorth.values[i] - lastKnownInvested;
      netGainSeries.data.push({ time, value: gain });
    }

    setLineChartSeries(netGainSeries.data.length ? [netGainSeries] : undefined);
  }, [filteredNetWorth, filteredTotalInvested]);

  const latestGain = lineChartSeries?.[0]?.data.at(-1)?.value ?? 0;
  const maxGain =
    lineChartSeries?.[0]?.data.reduce((m, p) => Math.max(m, p.value), 0) ?? 0;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-4 lg:px-0 flex-col w-full h-full justify-center items-center">
        <h2 className="text-xl font-bold md:text-3xl raleway text-gray-700 dark:text-gray-300">
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
          {lineChartSeries && containerRef.current && (
            <LineChart
              series={lineChartSeries}
              width={containerRef.current.offsetWidth}
              height={containerRef.current.offsetHeight}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NetGainHistory;
