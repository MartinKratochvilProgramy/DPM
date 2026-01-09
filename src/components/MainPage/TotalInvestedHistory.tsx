import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { numberWithSpacesRounded } from '@/utils/client/numberWithSpacesRounded';
import { CurrencyContext } from '@/pages/_app';
import LineChart, { type Series } from '../chart/LineChart';
import { TimeSeries } from '@/types/client/timeSeries';
import { DateRange } from '@/types/client/dateRange';
import { filterTimeSeriesByRange } from '@/utils/client/filterTimeSeriesByTimeRange';
import { formatDateToYYYYMMDD } from '@/types/client/formatDate';

interface Props {
  totalInvested: TimeSeries;
  dateRange: DateRange;
}

const TotalInvestedHistory: React.FC<Props> = ({
  totalInvested,
  dateRange,
}) => {
  const { currency } = useContext(CurrencyContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineChartSeries, setLineChartSeries] = useState<Series[]>();

  const filteredTotalInvested = useMemo(
    () => filterTimeSeriesByRange(totalInvested, dateRange),
    [totalInvested, dateRange]
  );

  useEffect(() => {
    // 🟡 If empty → assume invested = 0
    if (
      filteredTotalInvested.dates.length === 0 ||
      filteredTotalInvested.values.length === 0
    ) {
      const today = new Date();

      setLineChartSeries([
        {
          type: 'area',
          color: '#3b82f6',
          data: [
            {
              time: formatDateToYYYYMMDD(today),
              value: 0,
            },
          ],
        },
      ]);
      return;
    }

    const data = filteredTotalInvested.dates.flatMap((_, i) => {
      const points = [];

      if (i > 0) {
        points.push({
          time: formatDateToYYYYMMDD(filteredTotalInvested.dates[i]),
          value: filteredTotalInvested.values[i - 1],
        });
      }

      points.push({
        time: formatDateToYYYYMMDD(filteredTotalInvested.dates[i]),
        value: filteredTotalInvested.values[i],
      });

      return points;
    });

    setLineChartSeries([
      {
        data,
        color: '#3b82f6',
        type: 'area',
      },
    ]);
  }, [filteredTotalInvested]);

  const latestValue =
    filteredTotalInvested.values.at(-1) ?? 0;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-4 px-2 md:px-5 lg:px-0 flex-col w-full h-full justify-center items-center">
        <h2 className="text-xl md:text-3xl font-bold raleway mt-0 sm:mt-2 md:mt-4 lg:mt-0 mb-0 sm:mb-4 text-gray-700 dark:text-gray-300">
          {numberWithSpacesRounded(latestValue)}{' '}
          <span className="playfair text-[16px] md:text-[28px]">
            {currency ?? ''}
          </span>
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

export default TotalInvestedHistory;
