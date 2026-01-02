import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import { type TimeScaleInterface } from '@/types/client/timeScale';
import { type ChartLoadDuration } from '@/types/client/chartLoadDuration';
import '../../app/globals.css';
import { type InflationAdjustedValues } from '@/pages/api/portfolio/relative_change';

Chart.register(...registerables);

interface Props {
  todaysRelativeChange: number;
  relativeChangeDates: Date[];
  relativeChangeValues: number[];
  timeScale: TimeScaleInterface;
  inflationAdjustedChange: InflationAdjustedValues;
}

export const chartColor = '#949aa6';

const green = 'rgba(19, 168, 41, 1)';
const greenLowOpacity = 'rgba(19, 168, 41, 0.1)';
const red = 'rgba(220, 38, 38, 1)';
const redLowOpacity = 'rgba(220, 38, 38, 0.11)';
export const orange = 'rgb(249, 115, 22)';
export const orangeLowOpacity = 'rgb(249, 115, 22, 0.1)';

const RelativeChangeHistory: React.FC<Props> = ({
  todaysRelativeChange,
  relativeChangeDates,
  relativeChangeValues,
  timeScale,
  inflationAdjustedChange,
}) => {
  const [loadDuration, setLoadDuration] = useState<ChartLoadDuration>(1000);

  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: any;

    if (chartRef.current != null) {
      const ctx = chartRef.current.getContext('2d');

      const s1 = {
        label: 'Total Cumulative Return',
        data: relativeChangeDates.map((date, i) => ({
          x: date,
          y: relativeChangeValues[i],
        })),
        borderColor: lastValue >= 0 ? green : red,
        backgroundColor: lastValue >= 0 ? greenLowOpacity : redLowOpacity,
        fill: true,
        borderWidth: 1,
        pointRadius: 0.5,
      };

      const s2 = {
        label: 'Inflation Adjusted Return',
        data: inflationAdjustedChange.dates.map((date, i) => ({
          x: date,
          y: inflationAdjustedChange.values[i],
        })),
        borderColor: orange,
        backgroundColor: orangeLowOpacity,
        borderWidth: 1,
        pointRadius: 0.5,
      };

      if (ctx === null) return;

      // Create the chart instance
      chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: [s1, s2] },
        options: {
          responsive: true,
          animation: { duration: loadDuration },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: chartColor,
              },
            },
            title: {
              display: false,
              text: 'Net Worth',
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeScale,
              },
              display: true,
              title: {
                display: true,
              },
              grid: {
                color: chartColor,
              },
              ticks: {
                color: chartColor,
              },
            },
            y: {
              display: true,
              title: {
                display: false,
                text: 'Net Worth',
              },
              grid: {
                color: chartColor,
                z: 10,
              },
              ticks: {
                color: chartColor,
              },
            },
          },
        },
      });
    }

    if (loadDuration === 1000) {
      setLoadDuration(0);
    }

    // Cleanup function
    return () => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (chart) {
        chart.destroy();
      }
    };
  }, [relativeChangeDates, relativeChangeValues]);

  let lastValue: number;
  if (relativeChangeValues.at(-1) === undefined) {
    lastValue = 0;
  } else {
    lastValue =
      Math.round(relativeChangeValues[relativeChangeValues.length - 1] * 100) /
      100;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex pt-0 md:pt-0 lg:pt-3 px-2 md:px-5 lg:px-0 flex-col w-full h-full justify-center items-center">
        <h2
          style={{ color: lastValue >= 0 ? green : red }}
          className="text-xl space-x-1 flex text-center md:text-3xl raleway font-bold mt-0 sm:mt-2 md:mt-4 lg:mt-0 mb-0"
        >
          <div className="w-full h-full flex justify-center items-center">
            {lastValue >= 0 ? '+' : ''}
          </div>
          <div className="w-full h-full flex justify-center items-center">
            {lastValue}
          </div>
          <span className="w-full h-full flex justify-center items-centert">
            %
          </span>
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
          <div className="playfair space-x-1 flex text-center mt-0 sm:mt-2 md:mt-4 lg:mt-0 mb-0">
            <div className="w-full h-full flex justify-center items-center text-gray-400">
              Today:
            </div>
            <div className="w-full h-full flex justify-center items-center mt-[1px]">
              {todaysRelativeChange > 0 ? '+' : ''}
            </div>
            <div className="w-full h-full flex justify-center items-center">
              {todaysRelativeChange.toFixed(2)}
            </div>
            <div className="w-full h-full flex justify-center items-center mt-[1px]">
              %
            </div>
          </div>
        </h2>
        <div className="flex justify-center items-center w-full px-0 md:px-6 h-full">
          <canvas ref={chartRef} style={{ width: '0%', height: '0%' }}></canvas>
        </div>
      </div>
    </div>
  );
};

export default RelativeChangeHistory;
