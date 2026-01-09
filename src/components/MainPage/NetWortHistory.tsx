import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import 'chartjs-adapter-moment';
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded';
import { CurrencyContext } from '@/pages/_app';
import '../../app/globals.css';
import LineChart, { type Series } from '../chart/LineChart';
import { type LineData } from 'lightweight-charts';
import { orange } from './RelativeChangeHistory';
import { TimeSeries } from '@/types/client/timeSeries';
import { DateRange } from '@/types/client/dateRange';
import { filterTimeSeriesByRange, normalizeTimeSeries } from '@/utils/client/filterTimeSeriesByTimeRange';
import { formatDateToYYYYMMDD } from '@/types/client/formatDate';

interface Props {
  netWorth: TimeSeries;
  totalInvested: TimeSeries;
  dateRange: DateRange;
}

const NetWorthHistory: React.FC<Props> = ({ netWorth, totalInvested, dateRange }) => {
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>();
  const { currency } = useContext(CurrencyContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredNetWorth = useMemo(
    () => {
      const filteredSeries = filterTimeSeriesByRange(netWorth, dateRange)
      if (dateRange === "ALL") {
        return filteredSeries;
      } else {
        return normalizeTimeSeries(filteredSeries);
      }
    },
    [netWorth, dateRange]
  );
  const filteredTotalInvested = useMemo(
    () => {
      const filteredSeries = filterTimeSeriesByRange(totalInvested, dateRange)
      if (dateRange === "ALL") {
        return filteredSeries;
      } else {
        return normalizeTimeSeries(filteredSeries);
      }
    },
    [netWorth, dateRange]
  );


  useEffect(() => {
    const totalInvestedData = filteredTotalInvested.dates.flatMap((_, i) => {
      const values = [];
      if (i > 0) {
        values.push({
          time: formatDateToYYYYMMDD(filteredTotalInvested.dates[i]),
          value: filteredTotalInvested.values[i - 1],
        });
      } else {
        values.push({
          time: formatDateToYYYYMMDD(filteredTotalInvested.dates[i]),
          value: filteredTotalInvested.values[i],
        });
      }
      return values;
    });

    const lastDate = filteredNetWorth.dates.at(-1);
    const lastInvested = filteredTotalInvested.values.at(-1);
    if (lastDate && lastInvested !== undefined) {
      totalInvestedData.push({
        time: formatDateToYYYYMMDD(lastDate),
        value: lastInvested,
      });
    }

    const netWorthSeries: Series = { data: [], color: '#3b82f6', type: 'area' };

    for (let i = 0; i < filteredNetWorth.dates.length; i++) {
      const time = formatDateToYYYYMMDD(filteredNetWorth.dates[i]);
      if (!netWorthSeries.data.some((e: LineData) => e.time === time)) {
        netWorthSeries.data.push({
          time,
          value: filteredNetWorth.values[i],
        });
      }
    }

    const lastNetWorthValue = filteredNetWorth.values.at(-1);
    const lastDataPoint = netWorthSeries.data.at(-1);
    if (lastNetWorthValue !== undefined && lastDataPoint) {
      lastDataPoint.value = lastNetWorthValue;
    }

    setLineChartSeries([
      netWorthSeries,
      {
        data: totalInvestedData,
        color: orange,
        type: 'line',
      },
    ]);
  }, [netWorth, totalInvested, dateRange]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-4 lg:px-0 flex-col w-full h-full justify-center items-center">
        <h2 className="text-xl font-bold md:text-3xl raleway mt-1 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-0 text-gray-700 dark:text-gray-300">
          {numberWithSpacesRounded(netWorth.values[netWorth.values.length - 1])}{' '}
          <span className="text-[16px] md:text-[28px] playfair">
            {currency || ''}
          </span>
        </h2>
        <div className="text-gray-400 playfair">
          Max: {numberWithSpacesRounded(Math.max(...netWorth.values))}{' '}
          <span className="text-[8px] md:text-[12px] playfair">
            {currency || ''}
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

export default NetWorthHistory;
