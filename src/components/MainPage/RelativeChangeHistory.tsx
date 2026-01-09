import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../app/globals.css';

import LineChart, { type Series } from '../chart/LineChart';

import { TimeSeries } from '@/types/client/timeSeries';
import { DateRange } from '@/types/client/dateRange';
import { filterTimeSeriesByRange, normalizeGeometricTimeSeries, normalizeTimeSeries } from '@/utils/client/filterTimeSeriesByTimeRange';
import { formatDateToYYYYMMDD } from '@/types/client/formatDate';

export const chartColor = '#949aa6';

const green = 'rgba(19, 168, 41, 1)';
const red = 'rgba(220, 38, 38, 1)';
export const orange = 'rgb(249, 115, 22)';

interface Props {
  todaysRelativeChange: number;
  relativeChange: TimeSeries;
  inflationAdjustedChange: TimeSeries;
  dateRange: DateRange;
}

const RelativeChangeHistory: React.FC<Props> = ({
  todaysRelativeChange,
  relativeChange,
  inflationAdjustedChange,
  dateRange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>();

  const filteredRelativeChange = useMemo(
    () => {
      const filteredSeries = filterTimeSeriesByRange(relativeChange, dateRange);
      if (dateRange === "ALL") {
        return filteredSeries;
      } else {
        return normalizeTimeSeries(filteredSeries);
      }
    },
    [relativeChange, dateRange]
  );

  const filteredInflationAdjustedChange = useMemo(
    () => {
      const filteredSeries = filterTimeSeriesByRange(inflationAdjustedChange, dateRange);
      if (dateRange === "ALL") {
        return filteredSeries;
      } else {
        return normalizeTimeSeries(filteredSeries);
      }
    },
    [inflationAdjustedChange, dateRange]
  );

  const lastValue = filteredRelativeChange.values.at(-1) ?? 0;

  useEffect(() => {
    const relativeSeries: Series = {
      type: 'area',
      color: lastValue >= 0 ? green : red,
      data: [],
    };

    const inflationSeries: Series = {
      type: 'line',
      color: orange,
      data: [],
    };

    for (let i = 0; i < filteredRelativeChange.dates.length; i++) {
      relativeSeries.data.push({
        time: formatDateToYYYYMMDD(filteredRelativeChange.dates[i]),
        value: filteredRelativeChange.values[i],
      });
    }

    for (let i = 0; i < filteredInflationAdjustedChange.dates.length; i++) {
      inflationSeries.data.push({
        time: formatDateToYYYYMMDD(filteredInflationAdjustedChange.dates[i]),
        value: filteredInflationAdjustedChange.values[i],
      });
    }

    setLineChartSeries([relativeSeries, inflationSeries]);
  }, [
    filteredRelativeChange,
    filteredInflationAdjustedChange,
    lastValue,
  ]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-5 lg:px-0 flex-col w-full h-full justify-center items-center">
        {/* Main value */}
        <h2
          style={{ color: lastValue >= 0 ? green : red }}
          className="text-xl space-x-1 flex text-center md:text-3xl raleway font-bold"
        >
          <span>{lastValue >= 0 ? '+' : ''}</span>
          <span>{lastValue.toFixed(2)}</span>
          <span>%</span>
        </h2>

        <h2
          className={
            todaysRelativeChange > 0
              ? 'text-green-600'
              : todaysRelativeChange === 0
                ? 'text-gray-400'
                : 'text-red-500'
          }
        >
          <div className="playfair space-x-1 flex text-center mt-1">
            <span className="text-gray-400">Today:</span>
            <span>{todaysRelativeChange > 0 ? '+' : ''}</span>
            <span>{todaysRelativeChange.toFixed(2)}</span>
            <span>%</span>
          </div>
        </h2>

        <div
          ref={containerRef}
          className="flex justify-center items-center w-full px-0 md:px-6 h-full"
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

export default RelativeChangeHistory;
