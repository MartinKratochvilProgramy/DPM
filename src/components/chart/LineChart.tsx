import React, { useEffect, useRef } from 'react';
import {
  createChart,
  type LineData,
  ColorType,
  type IChartApi,
} from 'lightweight-charts';
import { chartColor } from '../MainPage/RelativeChangeHistory';

export interface Series {
  data: LineData[];
  color: string;
  type: 'area' | 'line';
}

interface LineChartProps {
  series: Series[];
  width?: number;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  series,
  width = 600,
  height = 300,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any[]>([]);

  useEffect(() => {
    if (chartContainerRef.current === null) return;

    // Create chart
    chartRef.current = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'rgba(0, 0, 0, 0)' },
        textColor: chartColor,
      },
      grid: {
        vertLines: {
          color: chartColor,
        },
        horzLines: {
          color: chartColor,
        },
      },
      timeScale: {
        fixLeftEdge: true,
        fixRightEdge: true,
        shiftVisibleRangeOnNewBar: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
    });

    chartRef.current.timeScale().fitContent();

    return () => {
      // Cleanup on component unmount
      chartRef.current?.remove();
    };
  }, [width, height]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!chartRef.current) return;

    series.forEach(({ data, color, type }, index) => {
      // Filter data to keep only the last entry for each date
      const uniqueDates = new Map();
      data.forEach((entry) => {
        uniqueDates.set(entry.time, entry.value); // Overwrites previous entry for the same date
      });

      // Convert the Map back to an array
      const filteredData = Array.from(uniqueDates, ([time, value]) => ({
        time,
        value,
      }));

      let chartSeries = seriesRef.current[index];

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!chartSeries) {
        chartSeries =
          type === 'area'
            ? chartRef.current?.addAreaSeries({
                lineColor: color,
                topColor: color,
                bottomColor: 'rgba(255, 255, 255, 0.28)',
                lineWidth: 1,
              })
            : chartRef.current?.addLineSeries({
                color,
                lineWidth: 1,
              });

        seriesRef.current[index] = chartSeries;
      }

      chartSeries.setData(filteredData); // Use the filtered data for further operations
    });

    // Remove extra series if the `series` prop has fewer items
    if (series.length < seriesRef.current.length) {
      seriesRef.current.slice(series.length).forEach((extraSeries) => {
        chartRef.current?.removeSeries(extraSeries);
      });
      seriesRef.current.length = series.length; // Trim the series reference array
    }
  }, [series]);

  return <div ref={chartContainerRef} />;
};

export default LineChart;
