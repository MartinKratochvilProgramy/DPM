import React, { useEffect, useRef, useState } from 'react';
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
}

const LineChart: React.FC<LineChartProps> = ({ series }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<any[]>([]);
  const [chart, setChart] = useState<IChartApi | null>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (container === null) return;

    // autoSize uses a ResizeObserver so the chart is sized correctly even if
    // the container has no dimensions during the first render.
    const newChart = createChart(container, {
      autoSize: true,
      width: container.clientWidth || 600,
      height: container.clientHeight || 300,
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

    seriesRef.current = [];
    setChart(newChart);

    return () => {
      newChart.remove();
      seriesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!chart) return;

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
            ? chart.addAreaSeries({
                lineColor: color,
                topColor: color,
                bottomColor: 'rgba(255, 255, 255, 0.28)',
                lineWidth: 1,
              })
            : chart.addLineSeries({
                color,
                lineWidth: 1,
              });

        seriesRef.current[index] = chartSeries;
      }

      chartSeries?.setData(filteredData); // Use the filtered data for further operations
    });

    // Remove extra series if the `series` prop has fewer items
    if (series.length < seriesRef.current.length) {
      seriesRef.current.slice(series.length).forEach((extraSeries) => {
        chart.removeSeries(extraSeries);
      });
      seriesRef.current.length = series.length; // Trim the series reference array
    }
    chart.timeScale().fitContent();
  }, [chart, series]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default LineChart;
