import React, { useContext, useEffect, useRef, useState } from 'react';
import 'chartjs-adapter-moment';
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded';
import { type TimeScaleInterface } from '@/types/client/timeScale';
import { CurrencyContext } from '@/pages/_app';
import '../../app/globals.css';
import LineChart, { type Series } from '../chart/LineChart';
import { type LineData } from 'lightweight-charts';
import { orange } from './RelativeChangeHistory';
import { TimeSeries } from '@/types/client/timeSeries';

function formatDateToYYYYMMDD(date: Date) {
  const parsedDate = new Date(date);

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(parsedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface Props {
  netWorth: TimeSeries;
  totalInvested: TimeSeries;
  timeScale: TimeScaleInterface;
}

const NetWortHistory: React.FC<Props> = ({
  netWorth,
  totalInvested,
}) => {
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>();

  const { currency } = useContext(CurrencyContext);

  const containerRef = useRef<any>();

  useEffect(() => {
    const totalInvestedData = totalInvested.dates.flatMap((date, i) => {
      const values = [];
      if (i > 0) {
        values.push({
          time: formatDateToYYYYMMDD(totalInvested.dates[i]),
          value: totalInvested.values[i - 1],
        });
      } else {
        values.push({
          time: formatDateToYYYYMMDD(totalInvested.dates[i]),
          value: totalInvested.values[i],
        });
      }
      return values;
    });

    const lastDate = netWorth.dates.at(-1);
    const lastInvested = totalInvested.values.at(-1);
    if (lastDate !== undefined && lastInvested !== undefined) {
      totalInvestedData.push({
        time: formatDateToYYYYMMDD(lastDate),
        value: lastInvested,
      });
    }

    const netWorthSeries: Series = { data: [], color: '#3b82f6', type: 'area' };
    for (let i = 0; i < netWorth.dates.length; i++) {
      const time = formatDateToYYYYMMDD(netWorth.dates[i]);

      // Push only if the date (time) does not already exist in the data array
      if (!netWorthSeries.data.some((e: LineData) => e.time === time)) {
        netWorthSeries.data.push({
          time,
          value: netWorth.values[i],
        });
      }
    }

    // update last value
    const lastNetWorthValue = netWorth.values.at(-1);
    const lastDataPoint = netWorthSeries.data.at(-1);
    if (lastNetWorthValue !== undefined && lastDataPoint?.value !== undefined) {
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
  }, [netWorth, totalInvested, totalInvested]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-4 lg:px-0 flex-col w-full h-full justify-center items-center">
        <h2 className="text-xl font-bold md:text-3xl raleway mt-1 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-0 text-gray-700 dark:text-gray-300">
          {numberWithSpacesRounded(netWorth.values[netWorth.values.length - 1])}{' '}
          <span className="text-[16px] md:text-[28px] playfair">
            {currency === undefined ? '' : currency}
          </span>
        </h2>
        <div className="text-gray-400 playfair">
          Max: {numberWithSpacesRounded(Math.max(...netWorth.values))}{' '}
          <span className="text-[8px] md:text-[12px] playfair">
            {currency === undefined ? '' : currency}
          </span>
        </div>
        <div
          ref={containerRef}
          className="flex justify-center items-center w-[90%] md:px-6 w-full h-full"
        >
          {lineChartSeries && (
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

export default NetWortHistory;
